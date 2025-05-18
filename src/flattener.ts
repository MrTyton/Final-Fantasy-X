// src/flattener.ts
import * as fs from 'fs-extra';
import * as path from 'path';

// Adjust this path if your LaTeX source files are elsewhere relative to the project root
const LATEX_SOURCES_DIR = path.join(__dirname, '..', 'latex_sources');
// Output file for the flattened content
const FLATTENED_OUTPUT_FILE = path.join(__dirname, '..', 'preprocessed_output.txt');

/**
 * Recursively loads a LaTeX file and resolves \input commands.
 * @param filePath Path to the LaTeX file, relative to LATEX_SOURCES_DIR or absolute.
 * @param currentDir The directory of the file currently being processed, for resolving relative paths in \input.
 * @param processedFiles Set to keep track of processed files to avoid circular dependencies.
 * @returns The content of the file with \input commands resolved.
 */
async function loadAndPreprocessFile(
    filePath: string,
    currentDir: string,
    processedFiles: Set<string> = new Set()
): Promise<string> {
    let absolutePath: string;
    if (path.isAbsolute(filePath)) {
        absolutePath = filePath;
    } else {
        // Try resolving relative to current file's directory first
        const pathRelativeToCurrent = path.resolve(currentDir, filePath);
        if (await fs.pathExists(pathRelativeToCurrent)) {
            absolutePath = pathRelativeToCurrent;
        } else {
            // Fallback to resolving relative to LATEX_SOURCES_DIR (for top-level inputs)
            absolutePath = path.resolve(LATEX_SOURCES_DIR, filePath);
        }
    }


    // Ensure .tex extension if not present
    if (path.extname(absolutePath) !== '.tex' && path.extname(absolutePath) !== '.txt') {
        if (await fs.pathExists(absolutePath + '.tex')) {
            absolutePath += '.tex';
        } else if (await fs.pathExists(absolutePath + '.txt')) { // If you use .txt
            absolutePath += '.txt';
        }
    }


    if (processedFiles.has(absolutePath)) {
        console.warn(`Circular dependency or duplicate input detected for: ${absolutePath}. Skipping.`);
        return ''; // Avoid infinite loops
    }
    processedFiles.add(absolutePath);

    if (!await fs.pathExists(absolutePath)) {
        console.error(`File not found: ${absolutePath} (tried from ${currentDir} and ${LATEX_SOURCES_DIR})`);
        return `ERROR_FILE_NOT_FOUND: ${filePath}`;
    }

    console.log(`Reading file: ${absolutePath}`);
    let content = await fs.readFile(absolutePath, 'utf-8');

    // 1. Remove comments (lines starting with %)
    content = content.replace(/%.*$/gm, '');
    // Remove block comments if you use a package like 'comment' (less common in simple docs)
    // content = content.replace(/\\begin\{comment\}[\s\S]*?\\end\{comment\}/gm, '');


    // 2. Resolve \input{filename} or \input{./path/to/filename}
    //    The path in \input is relative to the file containing the \input command.
    const inputRegex = /\\input\{(.*?)\}/g;
    let match;
    const newContentParts: string[] = [];
    let lastIndex = 0;
    const fileDirectory = path.dirname(absolutePath);

    while ((match = inputRegex.exec(content)) !== null) {
        newContentParts.push(content.substring(lastIndex, match.index));
        const inputFileRelativePath = match[1]; // This is relative to the current file

        console.log(`Found \input: {${inputFileRelativePath}} in ${absolutePath}`);
        // Recursively process the inputted file
        newContentParts.push(await loadAndPreprocessFile(inputFileRelativePath, fileDirectory, new Set(processedFiles)));
        lastIndex = inputRegex.lastIndex;
    }
    newContentParts.push(content.substring(lastIndex));
    content = newContentParts.join('');

    return content;
}

/**
 * Main function to start the flattening process.
 * @param mainTexFile The main LaTeX file (e.g., "FFX_Any_Compilation.tex") located in LATEX_SOURCES_DIR.
 */
async function flattenLatex(mainTexFile: string) {
    console.log(`Starting LaTeX flattening process for: ${mainTexFile}`);
    console.log(`Looking for LaTeX sources in: ${LATEX_SOURCES_DIR}`);
    console.log(`Output will be saved to: ${FLATTENED_OUTPUT_FILE}`);

    const mainFilePath = path.join(LATEX_SOURCES_DIR, mainTexFile);

    if (!await fs.pathExists(mainFilePath)) {
        console.error(`Main LaTeX file not found: ${mainFilePath}`);
        console.error(`Please ensure '${mainTexFile}' exists in '${LATEX_SOURCES_DIR}'.`);
        return;
    }

    try {
        const processedContent = await loadAndPreprocessFile(mainTexFile, LATEX_SOURCES_DIR, new Set());

        if (processedContent.includes('ERROR_FILE_NOT_FOUND')) {
            console.error("One or more files were not found during preprocessing. Aborting.");
            return;
        }

        await fs.ensureDir(path.dirname(FLATTENED_OUTPUT_FILE)); // Ensure output directory exists
        await fs.writeFile(FLATTENED_OUTPUT_FILE, processedContent, 'utf-8');
        console.log(`Flattened LaTeX content successfully saved to: ${FLATTENED_OUTPUT_FILE}`);
        console.log("You can now provide the content of this file to the AI.");

    } catch (error) {
        console.error("An error occurred during the flattening process:", error);
    }
}

// --- Script Execution ---
// Replace 'FFX_Any_Compilation.tex' with your actual main .tex file name if different.
// Make sure this file is located in your LATEX_SOURCES_DIR.
const mainFile = 'FFX_Any_Compilation.tex';

flattenLatex(mainFile).catch(err => {
    console.error("Unhandled error in flattenLatex:", err);
});