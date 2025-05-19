// scripts/generate-flag-map.ts
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // Used to get __dirname in ES Modules
import type { FFXSpeedrunGuide, AcquiredItemFlag } from '../src/types'; // Import all relevant types

// Get the directory name of the current module in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..'); // Root of the project (adjust if script is elsewhere)
const mainGuidePath = path.join(projectRoot, 'public/data/ffx_guide_main.json'); // Path to main guide JSON
const outputFilePath = path.join(projectRoot, 'src/generated/flagIdToItemNameMap.ts'); // Output file for generated map
const outputDir = path.dirname(outputFilePath); // Directory for output file

console.log('Generating flag ID to itemName map...');

// This map will hold flag IDs as keys and their corresponding itemName as values
const flagMap: Record<string, string> = {};

/**
 * Recursively searches an object for AcquiredItemFlag instances and populates flagMap.
 * - Handles both direct flag objects and arrays of flags (e.g., itemAcquisitionFlags arrays).
 * - Warns if duplicate IDs with different itemNames are found.
 * @param obj The object or array to search for flags.
 */
function findFlagsInObject(obj: any) {
    if (typeof obj !== 'object' || obj === null) {
        return;
    }

    if (Array.isArray(obj)) {
        obj.forEach(item => findFlagsInObject(item));
        return;
    }

    // Check if this object itself is an AcquiredItemFlag
    // A simple check based on expected properties of AcquiredItemFlag
    if (obj.type === undefined && obj.id && obj.itemName && obj.setType && obj.sourceDescription) {
        const flag = obj as AcquiredItemFlag;
        if (flagMap[flag.id] && flagMap[flag.id] !== flag.itemName) {
            console.warn(`Warning: Duplicate flag id "${flag.id}" with different itemNames: "${flagMap[flag.id]}" and "${flag.itemName}". Using the first one encountered or consider making IDs more unique if this is an issue.`);
        }
        if (!flagMap[flag.id]) {
            flagMap[flag.id] = flag.itemName;
        }
    }

    // Recursively search through properties
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // Specifically look for keys that are known to hold arrays of flags or flag objects
            if (key === 'itemAcquisitionFlags' && Array.isArray(obj[key])) {
                (obj[key] as AcquiredItemFlag[]).forEach(flag => {
                    if (flag.id && flag.itemName) {
                        if (flagMap[flag.id] && flagMap[flag.id] !== flag.itemName) {
                            console.warn(`Warning: Duplicate flag id "${flag.id}" (in itemAcquisitionFlags) with different itemNames: "${flagMap[flag.id]}" and "${flag.itemName}".`);
                        }
                        if (!flagMap[flag.id]) {
                            flagMap[flag.id] = flag.itemName;
                        }
                    }
                });
            } else {
                // Generic recursive search for any nested objects
                findFlagsInObject(obj[key]);
            }
        }
    }
}

/**
 * Main function to generate the flag ID to itemName map.
 * - Loads the main guide file and any referenced content files.
 * - Recursively searches for all AcquiredItemFlag instances.
 * - Writes the resulting map to a TypeScript file for use in the app.
 */
async function generateMap() {
    try {
        // Load and parse the main guide JSON file
        const mainGuideContent = fs.readFileSync(mainGuidePath, 'utf-8');
        const mainGuide = JSON.parse(mainGuideContent) as FFXSpeedrunGuide;

        // Collect all referenced content files (introduction, acknowledgements, chapters)
        const filesToProcess: string[] = [];
        if (mainGuide.introductionFile) filesToProcess.push(mainGuide.introductionFile);
        if (mainGuide.acknowledgementsFile) filesToProcess.push(mainGuide.acknowledgementsFile); // Less likely to have flags here
        if (mainGuide.chapterFiles) filesToProcess.push(...mainGuide.chapterFiles);

        // Process main guide direct content if any (less likely for flags if modular)
        if (mainGuide.introduction) findFlagsInObject({ content: mainGuide.introduction });
        if (mainGuide.chapters) findFlagsInObject({ chapters: mainGuide.chapters });

        // Process all referenced files for flags
        for (const relativeFilePath of filesToProcess) {
            const filePath = path.join(projectRoot, 'public', relativeFilePath.startsWith('/') ? relativeFilePath.substring(1) : relativeFilePath);
            console.log(`Processing file: ${filePath}`);
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const jsonData = JSON.parse(fileContent);
                findFlagsInObject(jsonData);
            } else {
                console.warn(`Warning: File not found - ${filePath}`);
            }
        }

        // Sort the map by ID for consistent output (optional, for readability)
        const sortedFlagMap: Record<string, string> = {};
        Object.keys(flagMap).sort().forEach(key => {
            sortedFlagMap[key] = flagMap[key];
        });

        // Generate the output TypeScript file content
        const outputContent = `// THIS FILE IS AUTO-GENERATED BY scripts/generate-flag-map.ts. DO NOT EDIT MANUALLY.
// Timestamp: ${new Date().toISOString()}

export const JSON_FLAG_ID_TO_TRACKER_KEY_MAP: Record<string, string> = ${JSON.stringify(sortedFlagMap, null, 2)};
`;

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        // Write the generated map to the output file
        fs.writeFileSync(outputFilePath, outputContent, 'utf-8');
        console.log(`Successfully generated ${outputFilePath} with ${Object.keys(sortedFlagMap).length} flag mappings.`);

    } catch (error) {
        // Log and exit on error
        console.error('Error generating flag ID to itemName map:', error);
        process.exit(1);
    }
}

// Run the map generation script
generateMap();