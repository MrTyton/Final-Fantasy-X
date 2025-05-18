const Ajv = require("ajv");
const fs = require("fs");
const path = require("path");
const glob = require("glob"); // Ensure you have run: npm install glob

// --- Configuration ---
const schemaPath = 'schema.json';
const logFilePath = 'validation_log.txt'; // <<< Output log file name
const mainDataFile = 'data/ffx_any_percent.json'; // Main guide file
const chapterDataPattern = 'public/data/chapters/*.json'; // Pattern for chapter files
const introDataFile = 'data/introduction.json'; // Introduction file
// No acknowledgements file specified for validation in user's last example

// Schema definition references (adjust if your schema uses $defs or has hashes)
const mainSchemaRef = '#/definitions/FFXSpeedrunGuide';
const chapterSchemaRef = '#/definitions/Chapter';
const introItemSchemaRef = '#/definitions/ChapterContent'; // Ref for items *within* the intro array
// --- End Configuration ---

// --- Logging Setup ---
// Clear/Create Log File at the start
try {
    fs.writeFileSync(logFilePath, `Validation Log - ${new Date().toISOString()}\n\n`);
    console.log(`Logging validation results to: ${logFilePath}`);
} catch (err) {
    console.error(`❌ FATAL: Could not write to log file ${logFilePath}:`, err);
    process.exit(1);
}

// Wrapper function to log to both console and file
function log(message, isError = false) {
    const output = message + '\n';
    // Append to log file
    try {
        fs.appendFileSync(logFilePath, output);
    } catch (err) {
        console.error(`ERROR: Could not append to log file ${logFilePath}:`, err);
    }

    // Only log pass/fail summary to console
    if (!isError || message.startsWith('  ❌ FAILED') || message.startsWith('  ✅ PASSED')) {
        console.log(message);
    }
}
// --- End Logging Setup ---

// --- AJV Setup ---
const ajv = new Ajv({
    allErrors: true,
    strict: true // Assuming schema regeneration removed non-standard keywords
});

let schema;
try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    schema = JSON.parse(schemaContent);
    log(`Schema loaded successfully from ${schemaPath}`);
    // Add the main schema with a key. This allows $ref pointers within it to work.
    ajv.addSchema(schema, 'mainSchema');
    log("Schema added to AJV instance with key 'mainSchema'.");
} catch (e) {
    log(`❌ FATAL: Error loading or parsing schema ${schemaPath}: ${e.message || e}`, true);
    process.exit(1);
}
// --- End AJV Setup ---

// --- Validation Logic ---
let filesValidated = 0;
let filesFailed = 0;
let allValid = true; // Assume success until proven otherwise

function validateFile(filePath, schemaReferenceKey, isArrayExpected = false) {
    log(`\n▶️ Validating: ${filePath} against definition referenced by ${schemaReferenceKey}`);
    filesValidated++;

    if (!fs.existsSync(filePath)) {
        log(`  ⚠️ SKIPPED: File not found at ${filePath}`, true);
        filesFailed++; // Count missing file as failure
        allValid = false;
        return;
    }
    if (!schemaReferenceKey || !schemaReferenceKey.includes('#/')) {
        log(`  ⚠️ SKIPPED: Invalid schema definition reference provided: ${schemaReferenceKey}. Should start with schemaKey#/...`, true);
        filesFailed++; // Count config error as failure
        allValid = false;
        return;
    }

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let schemaToValidateAgainst;

        if (isArrayExpected) {
            // Construct a schema that expects an array of items matching the reference
            schemaToValidateAgainst = {
                type: "array",
                items: { "$ref": schemaReferenceKey }
            };
            log(`   (Expecting top-level content to be an array)`);
        } else {
            // Construct a schema that directly references the expected object type
            schemaToValidateAgainst = { "$ref": schemaReferenceKey };
            log(`   (Expecting top-level content to be an object)`);
        }

        const validate = ajv.compile(schemaToValidateAgainst);
        const valid = validate(data);

        if (!valid) {
            log(`  ❌ FAILED: ${filePath}`, true);
            validate.errors.forEach(err => {
                log(`    - Error: ${err.message}`, true);
                log(`      Path in data: ${err.instancePath || '(root)'}`, true);
                // Log schema path for context, but might be complex due to $ref
                // log(`      Schema Path: ${err.schemaPath}`, true);
            });
            allValid = false;
            filesFailed++;
        } else {
            log(`  ✅ PASSED: ${filePath}`);
        }

    } catch (e) {
        // Catch JSON parsing errors or other exceptionstypes.t
        log(`  ❌ ERROR processing file ${filePath}: ${e.message || e}`, true);
        allValid = false;
        filesFailed++;
    }
}
// --- End Validation Logic ---

// --- Validation Execution ---
log("\n--- Starting Validation Process ---");

// Validate main file (Object type FFXSpeedrunGuide)
// validateFile(mainDataFile, `mainSchema${mainSchemaRef}`, false);

// Validate Introduction (Array of ChapterContent items)
// validateFile(introDataFile, `mainSchema${introItemSchemaRef}`, true); // True for array

// Validate Chapters (Object type Chapter)
const chapterFiles = glob.sync(chapterDataPattern);
if (chapterFiles.length === 0) {
    log(`\n⚠️ No chapter files found matching pattern: ${chapterDataPattern}`, true);
    allValid = false; // Consider this a failure if chapters are expected
    filesFailed++;
} else {
    log(`\nFound ${chapterFiles.length} chapter files to validate...`);
}
const specificChapterFile = '' // 'data\\chapters\\06_kilika.json'; // Set this to a specific file path if needed, or leave empty to process all files

if (specificChapterFile) {
    if (chapterFiles.includes(specificChapterFile)) {
        validateFile(specificChapterFile, `mainSchema${chapterSchemaRef}`, false); // False for object
    } else {
        log(`\n⚠️ Specific file ${specificChapterFile} not found in the chapter files list.`, true);
        allValid = false;
        filesFailed++;
    }
} else {
    chapterFiles.forEach(file => {
        validateFile(file, `mainSchema${chapterSchemaRef}`, false); // False for object
    });
}

// --- Summary ---
log("\n--- Validation Summary ---");
log(`Total Files Attempted: ${filesValidated}`);
log(`Files Passed: ${filesValidated - filesFailed}`);
log(`Files Failed/Skipped: ${filesFailed}`);

if (allValid && filesValidated > 0) {
    log("\n✅✅✅ All checked files conform to the schema definitions! ✅✅✅");
    process.exit(0); // Exit with success code
} else if (filesValidated === 0) {
    log("\n⚠️ No files were actually processed for validation. Check paths and patterns.", true);
    process.exit(1); // Exit with error code
} else {
    log("\n❌❌❌ Some files failed validation or were skipped. Please review the log file: validation_log.txt ❌❌❌", true);
    process.exit(1); // Exit with error code
}