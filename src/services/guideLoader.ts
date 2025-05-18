// src/services/guideLoader.ts

import type {
    FFXSpeedrunGuide,
    Chapter,
    ChapterContent,
    FormattedText,
} from '../types'; // Adjust path if your types.ts is elsewhere within src

const BASE_URL = ''; // Assuming files are served from the root.
// If deployed in a subfolder, this might need to be configured.

/**
 * Fetches and parses a JSON file from the given path.
 * @param path - The path to the JSON file (e.g., '/data/some_file.json').
 * @returns A promise that resolves with the parsed JSON data, or null if an error occurs.
 */
async function fetchJsonFile<T>(path: string): Promise<T | null> {
    try {
        const response = await fetch(`${BASE_URL}${path}`);
        if (!response.ok) {
            console.error(`Error fetching ${path}: ${response.status} ${response.statusText}`);
            return null;
        }
        const data: T = await response.json();
        return data;
    } catch (error) {
        console.error(`Error parsing JSON from ${path}:`, error);
        return null;
    }
}

/**
 * Loads the full FFX speedrun guide data, including linked chapter,
 * introduction, and acknowledgements files.
 * @param mainGuidePath - The path to the main guide JSON file (e.g., '/data/ffx_guide_main.json').
 * @returns A promise that resolves with the fully populated FFXSpeedrunGuide object, or null if critical data fails to load.
 */
export async function loadFullGuideData(mainGuidePath: string): Promise<FFXSpeedrunGuide | null> {
    const mainGuide = await fetchJsonFile<FFXSpeedrunGuide>(mainGuidePath);

    if (!mainGuide) {
        console.error('Failed to load the main guide file. Cannot proceed.');
        return null;
    }

    // Create a new object to avoid mutating the fetched one if it's cached or used elsewhere.
    const populatedGuide: FFXSpeedrunGuide = { ...mainGuide };

    // Load introduction content if specified by a file
    if (mainGuide.introductionFile && !mainGuide.introduction) {
        const introContent = await fetchJsonFile<ChapterContent[]>(mainGuide.introductionFile);
        if (introContent) {
            populatedGuide.introduction = introContent;
        } else {
            console.warn(`Failed to load introduction file: ${mainGuide.introductionFile}`);
            // Keep mainGuide.introduction as is (which might be undefined or pre-filled)
        }
    }

    // Load acknowledgements content if specified by a file
    if (mainGuide.acknowledgementsFile && !mainGuide.acknowledgements) {
        const ackContent = await fetchJsonFile<FormattedText[]>(mainGuide.acknowledgementsFile);
        if (ackContent) {
            populatedGuide.acknowledgements = ackContent;
        } else {
            console.warn(`Failed to load acknowledgements file: ${mainGuide.acknowledgementsFile}`);
        }
    }

    // Load chapters if specified by files
    if (mainGuide.chapterFiles && mainGuide.chapterFiles.length > 0 && (!mainGuide.chapters || mainGuide.chapters.length === 0)) {
        const chapterPromises = mainGuide.chapterFiles.map(filePath => fetchJsonFile<Chapter>(filePath));
        const loadedChapters = await Promise.all(chapterPromises);

        populatedGuide.chapters = loadedChapters.filter(chapter => chapter !== null) as Chapter[]; // Filter out any nulls from failed fetches

        if (populatedGuide.chapters.length !== mainGuide.chapterFiles.length) {
            console.warn('Some chapter files failed to load. The guide may be incomplete.');
        }
    }

    return populatedGuide;
}