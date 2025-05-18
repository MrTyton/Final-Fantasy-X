// src/types.ts

// --- Enums and Helper Types ---

/** Defines the type of update for a tracked resource. */
export type TrackedResourceUpdateType =
    | "auto_guaranteed"           // App automatically applies when section is passed (e.g., fixed battle drop).
    | "user_confirm_rng_gain"         // App presents a UI for user to confirm/input quantity GAINED (e.g., steals, RNG drops, overkills).
    | "user_confirm_rng_consumption"  // App presents a UI for user to confirm/input quantity CONSUMED (e.g., variable grenade use).
    | "consumption_implicit_grid" // App auto-deducts for sphere use inferred from grid node activation.
    | "consumption_explicit_fixed";   // App auto-deducts for fixed explicit consumptions (e.g., "Use X item").

/** Defines how an item flag's state is determined or set. */
export type AcquiredItemFlagSetType =
    | "user_prompt_after_event"         // App explicitly asks user after a specific event (e.g., Biran & Yenke drops).
    | "user_checkbox_on_pickup_or_drop" // App shows a checkbox for items that might be acquired/dropped/stolen.
    | "derived_from_user_choice";     // Flag's state is set based on another user choice or existing flag.

/** Behavior of an instruction/element based on Cutscene Remover (CSR) mod status. */
export type CSRBehavior =
    | "standard_only"   // Only applicable/shown if CSR is NOT active.
    | "csr_only"        // Only applicable/shown if CSR IS active.
    | "always_relevant"; // Applicable/shown regardless of CSR status (or if CSR status is irrelevant to it).

// --- Resource Tracking & Item Flags ---

/** Represents a consumable resource whose quantity is tracked (e.g., Power Spheres, Speed Spheres, Grenades). */
export interface TrackedResource {
    /** Name of the resource being tracked. */
    name: "PowerSphere" | "SpeedSphere" | "Grenade" | "SleepingPowder" | "SmokeBomb" | "SilenceGrenade" | string;
    /** Quantity of the resource gained (positive) or consumed (negative). For user-confirmed consumption, this might be the max/target. */
    quantity: number;
    /** How the application should handle this resource update. */
    updateType: TrackedResourceUpdateType;
    /** A unique identifier for this specific resource update instance, for the app to prevent double-counting. */
    id: string;
    /** Optional textual description of the source/reason for this update (e.g., "From Tros Overkill"). */
    description?: string;
    /** Optional condition text if this resource update itself is conditional on a prior state/event. */
    condition?: FormattedText[];
}

/** Represents an item or game state whose acquisition/status is a boolean flag, often affecting conditional logic. */
export interface AcquiredItemFlag {
    /** Name/identifier of the item or state being flagged. */
    itemName:
    | "ReturnSpheres_2_From_BiranYenke"
    | "ReturnSpheres_4_From_BiranYenke"
    | "FriendSpheres_All_From_BiranYenke"
    | "ZombieStrikeWeapon"
    | "IceBrand"
    | "ThunderBall"
    | "LightningSteel"
    | "LightCurtain"
    | "LunarCurtain"
    | "SpherimorphElementalItem_Fire"
    | "SpherimorphElementalItem_Ice"
    | "SpherimorphElementalItem_Water"
    | "SpherimorphElementalItem_Thunder"
    | "FortuneSphere"
    | "LuckSphere"
    | "Lv1KeySphere"
    | "Lv2KeySphere"
    | "Lv3KeySphere"
    | "Lv4KeySphere"
    | "TidusHasHaste"
    | "BlitzballGameWon_Luca"
    | "BoughtAnyDistiller_AirshipRin"
    | "ZombieStrikeWeapon_Tidus"
    | "ZombieStrikeWeapon_Yuna"
    | "ZombieStrikeWeapon_Auron"
    | "ZombieStrikeWeapon_Rikku"
    | "ZombieStrikeWeapon_OtherNonFirstStrikeChar"
    | "NoZombieStrikeWeaponDropped"
    | string; // Fallback for other flaggable item names
    /** How the application determines the state of this flag. */
    setType: AcquiredItemFlagSetType;
    /** Textual description of where/how this item/state is acquired or determined. */
    sourceDescription: string;
    /** A unique identifier for this flag. */
    id: string;
    /** Optional text to be displayed to the user for prompts related to this flag (e.g., "Did you get a Zombie Strike weapon?"). */
    promptText?: string;
}


// --- Root Document Structure ---

/** Represents the entire speedrun guide. */
export interface FFXSpeedrunGuide {
    /** The main title of the speedrun guide. */
    title: string;
    /** Path to a separate JSON file containing the introduction content (modular approach). */
    introductionFile?: string;
    /** Direct content of the introduction, if not using a separate file. */
    introduction?: ChapterContent[];
    /** Path to a separate JSON file for acknowledgements (modular approach). */
    acknowledgementsFile?: string;
    /** Direct content of acknowledgements, if not using a separate file. */
    acknowledgements?: FormattedText[];
    /** Array of paths to individual chapter JSON files (modular approach). */
    chapterFiles?: string[];
    /** Direct array of chapter objects, if not using separate files. */
    chapters?: Chapter[];
}

/** Represents a single chapter in the guide. */
export interface Chapter {
    /** Unique identifier for the chapter (e.g., "chapter_02_zanarkand"). */
    id: string;
    /** The display title of the chapter. */
    title: string;
    /** An array of content blocks that make up the chapter. */
    content: ChapterContent[];
}

// --- Union type for any top-level content within a chapter or introduction ---
/** A union of all possible block-level content types within a chapter. */
export type ChapterContent =
    | InstructionListBlock
    | BattleBlock
    | ShopBlock
    | SphereGridBlock
    | EncountersBlock
    | TrialBlock
    | BlitzballGameBlock
    | EquipBlock
    | ImageBlock
    | TextParagraphBlock
    | ConditionalBlock;

// --- Block Level Elements ---

/** Represents a paragraph of text. */
export interface TextParagraphBlock {
    type: "textParagraph";
    /** Array of inline elements that make up the paragraph. */
    content: InlineElement[];
    /** Optional hint for special display, like the emphasized "READ EVERY LINE" blocks. */
    displayHint?: "emphasizedBlock";
}

/** Represents an ordered (enumerate) or unordered (itemize) list. */
export interface InstructionListBlock {
    type: "instructionList";
    /** True if the list is ordered (e.g., <ol>), false for unordered (e.g., <ul>). */
    ordered: boolean;
    /** True if the list enumeration should resume from a previous list. */
    resume?: boolean;
    /** Array of list items. */
    items: ListItemElement[];
}

/** Represents a battle encounter. */
export interface BattleBlock {
    type: "battle";
    /** The name of the enemy or battle. */
    enemyName: string;
    /** Optional HP of the enemy/boss. */
    hp?: number;
    /** Array of strategy steps, which can include list items or conditional blocks. */
    strategy: (ListItemElement | ConditionalBlock)[];
    /** Optional textual notes pertaining to the battle, displayed after the main strategy. */
    notes?: FormattedText[];
    /** Array of tracked resource updates associated with this battle (e.g., drops). */
    trackedResourceUpdates?: TrackedResource[];
    /** Array of item/state flags relevant to this battle (e.g., specific item drops to check for). */
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/** Represents a shop interaction. */
export interface ShopBlock {
    type: "shop";
    /** Textual information about Gil requirements or totals for the shop. */
    gilInfo: string;
    /** Sections within the shop, typically "Sell" and "Buy". */
    sections: ShopSection[];
}

/** Represents a section within a shop (e.g., "Sell" or "Buy"). */
export interface ShopSection {
    /** Title of the shop section. */
    title: "Sell" | "Buy" | string; // Can be "Note" or other custom titles.
    /** Items listed under this section, can include conditionals. */
    items: (ListItemElement | ConditionalBlock)[];
}

/** Represents a sphere grid section. */
export interface SphereGridBlock {
    type: "sphereGrid";
    /** Optional context information for the sphere grid (e.g., character name, condition like "4 Return Spheres"). */
    contextInfo?: string;
    /** Content of the sphere grid, can be character-specific actions, conditionals, images, or general list items. */
    content: (SphereGridCharacterActions | ConditionalBlock | ImageBlock | ListItemElement)[];
}

/** Represents sphere grid actions for a specific character. */
export interface SphereGridCharacterActions {
    type: "sphereGridCharacterActions";
    /** Name of the character whose grid is being modified. */
    character: string;
    /** Optional information about S.Levels required or gained. */
    slvlInfo?: string;
    /** Optional inline condition text (e.g., "If no OD"). */
    inlineCondition?: FormattedText[];
    /** Array of actions/steps on the grid, can include conditionals. */
    actions: (ListItemElement | ConditionalBlock)[];
    /** Optional image associated with this character's grid segment. */
    associatedImages?: ImageBlock[];
    /** Tracked resource updates (e.g., sphere consumption) for this entire grid segment. */
    trackedResourceUpdates?: TrackedResource[];
}

/** Represents a block detailing general encounter strategies for an area. */
export interface EncountersBlock {
    type: "encounters";
    /** List items or conditional blocks detailing encounter strategies. */
    content: (ListItemElement | ConditionalBlock)[];
    /** General notes for encounters in the area. */
    notes?: FormattedText[];
    /** Tracked resources gained from general encounters in this area. */
    trackedResourceUpdates?: TrackedResource[];
    /** Item flags relevant to general encounters in this area. */
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/** Represents a Cloister of Trials puzzle. */
export interface TrialBlock {
    type: "trial";
    /** Array of steps to solve the trial. */
    steps: ListItemElement[];
    /** Tracked resources gained from completing the trial. */
    trackedResourceUpdates?: TrackedResource[];
    /** Item flags set upon completing the trial. */
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/** Represents a Blitzball game. */
export interface BlitzballGameBlock {
    type: "blitzballGame";
    /** Array of strategy items for playing the Blitzball game. */
    strategy: ListItemElement[];
}

/** Represents an equipment setup or change. */
export interface EquipBlock {
    type: "equip";
    /** List items or conditional blocks detailing equipment changes. */
    content: (ListItemElement | ConditionalBlock)[];
}

/** Represents an image. */
export interface ImageBlock {
    type: "image";
    /** Path to the image file. */
    path: string;
    /** Optional general width parameter (from \includegraphics). */
    width?: string;
    /** Optional width for multi-column layout (from \sggraphics). */
    multiColumnWidth?: string;
    /** Optional width for single-column layout (from \sggraphics). */
    singleColumnWidth?: string;
}

// --- Conditional Logic ---

/** Represents one option within a multi-choice conditional block. */
export interface ConditionalOption {
    /** The text describing the condition for this option (e.g., "With Sleeping Powder:"). */
    conditionText: string;
    /** The content (instructions, blocks) that applies if this option is chosen. */
    content: (InlineElement | ChapterContent | ListItemElement)[];
}

/** Represents a block of content that is displayed conditionally. */
export interface ConditionalBlock {
    type: "conditional";
    /** The source or type of the condition being evaluated. */
    conditionSource:
    | "blitzballdetermination"        // For \blitzballdetermination{}{}, \blitzballSphereGrid
    | "ifthenelse_blitzresult"        // For generic \ifthenelse{\equal{\blitzresult}{VALUE}}
    | "textual_direct_choice"       // For \item \textit{Condition:} \begin{itemize}...\end{itemize}
    | "textual_inline_if_then"      // For \item Some text \textit{if condition} then X [else Y].
    | "textual_block_options"       // For Bevelle Guard Fights (options presented at block level)
    | "tracked_resource_check"      // For conditions based on resource counts (e.g., Grenades < 6)
    | "acquired_item_flag_check";   // For conditions based on acquired item flags (e.g., Has ZombieStrikeWeapon)

    // --- Fields for 'blitzballdetermination' & 'ifthenelse_blitzresult' ---
    /** Content to display if the Blitzball result is "win" or the primary if/then condition is true. */
    winContent?: (InlineElement | ChapterContent | ListItemElement)[];
    /** Content to display if the Blitzball result is "loss" or the primary if/then condition is false. */
    lossContent?: (InlineElement | ChapterContent | ListItemElement)[];
    /** Content to display if the Blitzball result is "both" (for LaTeX source that handles all three cases). */
    bothContent?: (InlineElement | ChapterContent | ListItemElement)[];
    /** If true, indicates the \blitzballdetermination was wrapped in an itemized condition like "\item \textit{If you won/lost blitz:}". */
    displayAsItemizedCondition?: boolean;

    // --- Fields for 'textual_direct_choice' & 'textual_block_options' ---
    /** Array of distinct conditional options the user can choose from or that describe different scenarios. */
    options?: ConditionalOption[];

    // --- Fields for 'textual_inline_if_then' ---
    /** The textual representation of the "if..." part of the condition. */
    textCondition?: FormattedText[];
    /** Content to display if the `textCondition` is met or evaluated as true. */
    thenContent?: (InlineElement | ChapterContent | ListItemElement)[];
    /** Optional content to display if the `textCondition` is NOT met (for explicit "else" branches). */
    elseContent?: (InlineElement | ChapterContent | ListItemElement)[];

    // --- Fields for 'tracked_resource_check' ---
    /** Name of the tracked resource to check (e.g., "Grenade"). */
    resourceName?: "PowerSphere" | "SpeedSphere" | "Grenade" | string;
    /** Type of comparison to perform. */
    comparison?: "less_than" | "greater_than_or_equal_to" | "equals" | "not_equals";
    /** The value to compare the resource count against. */
    value?: number;
    /** Content to display if the resource check condition is true. */
    contentToShowIfTrue?: (ListItemElement | CharacterCommand | ChapterContent)[];
    /** Content to display if the resource check condition is false. */
    contentToShowIfFalse?: (ListItemElement | CharacterCommand | ChapterContent)[];

    // --- Fields for 'acquired_item_flag_check' ---
    /** The name or ID of the AcquiredItemFlag to check. */
    flagName?: string;
    // Uses contentToShowIfTrue and contentToShowIfFalse from above.

    // --- Common optional fields for conditionals ---
    /** For complex if/then/else structures in LaTeX that had a common "then" part after specific branches. */
    thenContentForAll?: (InlineElement | ChapterContent | ListItemElement)[];
    /** One-off textual notes related to the conditional. */
    additionalNote?: string;
    /** General notes for the entire conditional block. */
    notes?: FormattedText[];
    /** Item flags that might be set as a result of a choice within this conditional. */
    itemAcquisitionFlags?: AcquiredItemFlag[];
}


// --- List Item and Inline Elements ---

/** Represents a single item in a list (\item). */
export interface ListItemElement {
    type: "listItem";
    /** The main content of the list item, can be a mix of inline elements or nested block structures. */
    content: (InlineElement | InstructionListBlock | ConditionalBlock | TextParagraphBlock | SphereGridBlock | EquipBlock | BattleBlock | EncountersBlock)[];
    /** Optional resources updated by this list item (e.g., a \pickup command). */
    trackedResourceUpdates?: TrackedResource[];
    /** Optional item flags set by this list item. */
    itemAcquisitionFlags?: AcquiredItemFlag[];
    /** Optional further indented sub-items or content not part of a formal nested list block. */
    subContent?: (InlineElement | ChapterContent | ListItemElement)[];
    /** Behavior of this item based on CSR mod status. */
    csrBehavior?: CSRBehavior;
    /** Optional note related to CSR behavior (e.g., "(Ignore if playing with CSR)"). */
    csrNote?: FormattedText[];
}

/** A union of all possible inline (text-level) element types. */
export type InlineElement =
    | PlainTextElement
    | FormattedText
    | CharacterReference
    | CharacterCommand
    | GameMacro
    | FormationElement
    | LinkElement
    | NthElement
    | NumberElement
    | MathSymbolElement;

/** Represents a segment of plain, unformatted text. */
export interface PlainTextElement {
    type: "plainText";
    text: string;
}

/** Represents text with specific formatting (bold, italic, color, etc.). */
export interface FormattedText {
    type: "formattedText";
    text: string;
    isBold?: boolean;
    isItalic?: boolean;
    color?: string;
    isLarge?: boolean;
    /** Hint for special display, like centered headers. */
    displayHint?: "centeredHeader";
    /** Text decoration, e.g., for links. */
    textDecoration?: "underline";
}

/** Represents a reference to a game character, including styling. */
export interface CharacterReference {
    type: "characterReference";
    characterName: string; // e.g., "Tidus", "Lulu", "Enemy", "Valefor"
    color?: string;
    isBold?: boolean;
}

/** Represents a command or action performed by a character. */
export interface CharacterCommand {
    type: "characterCommand";
    /** Name of the character performing the action. */
    characterName: string;
    /** Text describing the action (e.g., "Attack", "Haste Yuna"). */
    actionText: string;
    color?: string;
    isBold?: boolean;
    /** For commands with further itemized details (e.g., Blitzball shot options). */
    subItems?: ListItemElement[];
    /** Resources updated directly by this command. */
    trackedResourceUpdates?: TrackedResource[];
    /** Item flags set directly by this command. */
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/** Represents a common game macro/instruction (e.g., \sd, \cs). */
export interface GameMacro {
    type: "gameMacro";
    macroName: "sd" | "cs" | "fmv" | "skippableFmv" | "save" | "pickup" | "od";
    /** Optional value associated with the macro (e.g., time for \cs[3:40], item name for \pickup). */
    value?: string;
}

/** Represents a party formation. */
export interface FormationElement {
    type: "formation";
    characters: CharacterReference[];
}

/** Represents a hyperlink. */
export interface LinkElement {
    type: "link";
    url: string;
    text: FormattedText[];
}

/** Represents an ordinal number (e.g., 1st, 2nd). */
export interface NthElement {
    type: "nth";
    value: string; // "1st", "2nd", etc.
}

/** Represents a number formatted with \num{}. */
export interface NumberElement {
    type: "num";
    value: number;
}

/** Represents a mathematical symbol (e.g., arrows). */
export interface MathSymbolElement {
    type: "mathSymbol";
    /** The symbol, either as raw LaTeX (e.g., "\leftarrow") or a pre-processed representation. */
    symbol: string;
}