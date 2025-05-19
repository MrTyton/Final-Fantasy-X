// src/services/guideLoader.ts

import type {
    FFXSpeedrunGuide,
    Chapter,
    ChapterContent,
    FormattedText,
} from '../types'; // Types for guide structure and content

// APP_BASE_URL is the base path for all fetches. This is set by the build tool (e.g., Vite) and may be a subfolder.
// If not set, defaults to '/'. If deploying in a subfolder, ensure this is configured correctly.
const APP_BASE_URL = import.meta.env.BASE_URL || '/';

/**
 * Fetches and parses a JSON file from the given path.
 * - Path should be absolute from the public root (e.g., '/data/some_file.json').
 * - APP_BASE_URL will be prepended if it's not just '/'. Handles double slashes and subfolder deployment.
 * @param path - The path to the JSON file (e.g., '/data/some_file.json').
 * @returns A promise that resolves with the parsed JSON data, or null if an error occurs.
 */
async function fetchJsonFile<T>(path: string): Promise<T | null> {
    try {
        // Construct the fetch URL, handling subfolder deployment and avoiding double slashes
        let fetchUrl = path;
        if (APP_BASE_URL && APP_BASE_URL !== '/') {
            // If APP_BASE_URL is '/Final-Fantasy-X/' and path is '/data/file.json',
            // we want '/Final-Fantasy-X/data/file.json'.
            // If path already includes base (less likely), don't double-prefix.
            if (path.startsWith(APP_BASE_URL)) {
                fetchUrl = path;
            } else {
                // Remove trailing slash from base and ensure path starts with '/'
                const cleanBase = APP_BASE_URL.endsWith('/') ? APP_BASE_URL.slice(0, -1) : APP_BASE_URL;
                const cleanPath = path.startsWith('/') ? path : `/${path}`;
                fetchUrl = `${cleanBase}${cleanPath}`;
            }
        }
        // Fetch the JSON file from the constructed URL
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            // Log error if fetch fails (e.g., 404 or network error)
            console.error(`Error fetching ${fetchUrl}: ${response.status} ${response.statusText}`);
            return null;
        }
        // Parse and return the JSON data
        const data: T = await response.json();
        return data;
    } catch (error) {
        // Log error if parsing or network fails
        console.error(`Error parsing JSON from ${path} (resolved as ${APP_BASE_URL}${path}):`, error);
        return null;
    }
}

/**
 * Loads the full FFX speedrun guide data, including linked chapter, introduction, and acknowledgements files.
 * - Loads the main guide file, then loads introduction, acknowledgements, and chapters if specified by file paths.
 * - Populates the FFXSpeedrunGuide object with all loaded content.
 * @param mainGuidePath - The path to the main guide JSON file (e.g., '/data/ffx_guide_main.json').
 * @returns A promise that resolves with the fully populated FFXSpeedrunGuide object, or null if critical data fails to load.
 */
export async function loadFullGuideData(mainGuidePath: string): Promise<FFXSpeedrunGuide | null> {
    // Load the main guide file (core structure, may reference other files)
    const mainGuide = await fetchJsonFile<FFXSpeedrunGuide>(mainGuidePath);

    if (!mainGuide) {
        // If the main guide fails to load, abort and return null
        console.error('Failed to load the main guide file. Cannot proceed.');
        return null;
    }

    // Create a new object to avoid mutating the fetched one if it's cached or used elsewhere.
    const populatedGuide: FFXSpeedrunGuide = { ...mainGuide };

    // Load introduction content if specified by a file and not already present
    if (mainGuide.introductionFile && !mainGuide.introduction) {
        const introContent = await fetchJsonFile<ChapterContent[]>(mainGuide.introductionFile);
        if (introContent) {
            populatedGuide.introduction = introContent;
        } else {
            // Warn if introduction file fails to load, but continue
            console.warn(`Failed to load introduction file: ${mainGuide.introductionFile}`);
        }
    }

    // Load acknowledgements content if specified by a file and not already present
    if (mainGuide.acknowledgementsFile && !mainGuide.acknowledgements) {
        const ackContent = await fetchJsonFile<FormattedText[]>(mainGuide.acknowledgementsFile);
        if (ackContent) {
            populatedGuide.acknowledgements = ackContent;
        } else {
            // Warn if acknowledgements file fails to load, but continue
            console.warn(`Failed to load acknowledgements file: ${mainGuide.acknowledgementsFile}`);
        }
    }

    // Load chapters if specified by files and not already present
    if (mainGuide.chapterFiles && mainGuide.chapterFiles.length > 0 && (!mainGuide.chapters || mainGuide.chapters.length === 0)) {
        // Fetch all chapter files in parallel
        const chapterPromises = mainGuide.chapterFiles.map(filePath => fetchJsonFile<Chapter>(filePath));
        const loadedChapters = await Promise.all(chapterPromises);

        // Filter out any chapters that failed to load (nulls)
        populatedGuide.chapters = loadedChapters.filter(chapter => chapter !== null) as Chapter[];

        if (populatedGuide.chapters.length !== mainGuide.chapterFiles.length) {
            // Warn if some chapters failed to load, but continue with what was loaded
            console.warn('Some chapter files failed to load. The guide may be incomplete.');
        }
    }

    // Return the fully populated guide object
    return populatedGuide;
}