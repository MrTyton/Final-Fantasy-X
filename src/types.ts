// src/types.ts
// --- Enums and Helper Types ---

/**
 * Defines the type of update for a tracked resource.
 * - auto_guaranteed: App automatically applies when section is passed (e.g., fixed battle drop).
 * - user_confirm_rng_gain: App presents a UI for user to confirm/input quantity GAINED (e.g., steals, RNG drops, overkills).
 * - user_confirm_rng_consumption: App presents a UI for user to confirm/input quantity CONSUMED (e.g., variable grenade use).
 * - consumption_implicit_grid: App auto-deducts for sphere use inferred from grid node activation.
 * - consumption_explicit_fixed: App auto-deducts for fixed explicit consumptions (e.g., "Use X item").
 */
export type TrackedResourceUpdateType =
    | "auto_guaranteed"
    | "user_confirm_rng_gain"
    | "user_confirm_rng_consumption"
    | "consumption_implicit_grid"
    | "consumption_explicit_fixed";

/**
 * Defines how an item flag's state is determined or set.
 * - user_prompt_after_event: App explicitly asks user after a specific event (e.g., Biran & Yenke drops).
 * - user_checkbox_on_pickup_or_drop: App shows a checkbox for items that might be acquired/dropped/stolen.
 * - derived_from_user_choice: Flag's state is set based on another user choice or existing flag.
 */
export type AcquiredItemFlagSetType =
    | "user_prompt_after_event"
    | "user_checkbox_on_pickup_or_drop"
    | "derived_from_user_choice";

/**
 * Behavior of an instruction/element based on Cutscene Remover (CSR) mod status.
 * - standard_only: Only applicable/shown if CSR is NOT active.
 * - csr_only: Only applicable/shown if CSR IS active.
 * - always_relevant: Applicable/shown regardless of CSR status (or if CSR status is irrelevant to it).
 */
export type CSRBehavior =
    | "standard_only"
    | "csr_only"
    | "always_relevant";

// --- Resource Tracking & Item Flags ---

/**
 * Represents a consumable resource whose quantity is tracked (e.g., Power Spheres, Speed Spheres, Grenades).
 * - name: Name of the resource being tracked.
 * - quantity: Quantity of the resource gained (positive) or consumed (negative). For user-confirmed consumption, this might be the max/target.
 * - updateType: How the application should handle this resource update.
 * - id: A unique identifier for this specific resource update instance, for the app to prevent double-counting.
 * - description: Optional textual description of the source/reason for this update (e.g., "From Tros Overkill").
 * - condition: Optional condition text if this resource update itself is conditional on a prior state/event.
 */
export interface TrackedResource {
    name: "PowerSphere" | "SpeedSphere" | "Grenade" | "SleepingPowder" | "SmokeBomb" | "SilenceGrenade" | string;
    quantity: number;
    updateType: TrackedResourceUpdateType;
    id: string;
    description?: string;
    condition?: FormattedText[];
}

/**
 * Represents an item or game state whose acquisition/status is a boolean flag, often affecting conditional logic.
 * - itemName: Name/identifier of the item or state being flagged.
 * - setType: How the application determines the state of this flag.
 * - sourceDescription: Textual description of where/how this item/state is acquired or determined.
 * - id: A unique identifier for this flag.
 * - promptText: Optional text to be displayed to the user for prompts related to this flag (e.g., "Did you get a Zombie Strike weapon?").
 */
export interface AcquiredItemFlag {
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
    | string;
    setType: AcquiredItemFlagSetType;
    sourceDescription: string;
    id: string;
    promptText?: string;
}

// --- Root Document Structure ---

/**
 * Represents the entire speedrun guide.
 * - title: The main title of the speedrun guide.
 * - introductionFile: Path to a separate JSON file containing the introduction content (modular approach).
 * - introduction: Direct content of the introduction, if not using a separate file.
 * - acknowledgementsFile: Path to a separate JSON file for acknowledgements (modular approach).
 * - acknowledgements: Direct content of acknowledgements, if not using a separate file.
 * - chapterFiles: Array of paths to individual chapter JSON files (modular approach).
 * - chapters: Direct array of chapter objects, if not using separate files.
 */
export interface FFXSpeedrunGuide {
    title: string;
    introductionFile?: string;
    introduction?: ChapterContent[];
    acknowledgementsFile?: string;
    acknowledgements?: FormattedText[];
    chapterFiles?: string[];
    chapters?: Chapter[];
}

/**
 * Represents a single chapter in the guide.
 * - id: Unique identifier for the chapter (e.g., "chapter_02_zanarkand").
 * - title: The display title of the chapter.
 * - content: An array of content blocks that make up the chapter.
 */
export interface Chapter {
    id: string;
    title: string;
    content: ChapterContent[];
}

// --- Union type for any top-level content within a chapter or introduction ---

/**
 * A union of all possible block-level content types within a chapter.
 * - InstructionListBlock: Represents an ordered or unordered list.
 * - BattleBlock: Represents a battle encounter.
 * - ShopBlock: Represents a shop interaction.
 * - SphereGridBlock: Represents a sphere grid section.
 * - EncountersBlock: Represents general encounter strategies for an area.
 * - TrialBlock: Represents a Cloister of Trials puzzle.
 * - BlitzballGameBlock: Represents a Blitzball game.
 * - EquipBlock: Represents an equipment setup or change.
 * - ImageBlock: Represents an image.
 * - TextParagraphBlock: Represents a paragraph of text.
 * - ConditionalBlock: Represents a block of content that is displayed conditionally.
 */
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

/**
 * Represents a paragraph of text.
 * - type: Specifies the block type as "textParagraph".
 * - content: Array of inline elements that make up the paragraph.
 * - displayHint: Optional hint for special display, like the emphasized "READ EVERY LINE" blocks.
 */
export interface TextParagraphBlock {
    type: "textParagraph";
    content: InlineElement[];
    displayHint?: "emphasizedBlock";
}

/**
 * Represents an ordered (enumerate) or unordered (itemize) list.
 * - type: Specifies the block type as "instructionList".
 * - ordered: True if the list is ordered (e.g., <ol>), false for unordered (e.g., <ul>).
 * - resume: True if the list enumeration should resume from a previous list.
 * - items: Array of list items.
 */
export interface InstructionListBlock {
    type: "instructionList";
    ordered: boolean;
    resume?: boolean;
    items: ListItemElement[];
}

/**
 * Represents a battle encounter.
 * - type: Specifies the block type as "battle".
 * - enemyName: The name of the enemy or battle.
 * - hp: Optional HP of the enemy/boss.
 * - strategy: Array of strategy steps, which can include list items or conditional blocks.
 * - notes: Optional textual notes pertaining to the battle, displayed after the main strategy.
 * - trackedResourceUpdates: Array of tracked resource updates associated with this battle (e.g., drops).
 * - itemAcquisitionFlags: Array of item/state flags relevant to this battle (e.g., specific item drops to check for).
 */
export interface BattleBlock {
    type: "battle";
    enemyName: string;
    hp?: number;
    strategy: (ListItemElement | ConditionalBlock)[];
    notes?: FormattedText[];
    trackedResourceUpdates?: TrackedResource[];
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/**
 * Represents a shop interaction.
 * - type: Specifies the block type as "shop".
 * - gilInfo: Textual information about Gil requirements or totals for the shop.
 * - sections: Sections within the shop, typically "Sell" and "Buy".
 */
export interface ShopBlock {
    type: "shop";
    gilInfo: string;
    sections: ShopSection[];
}

/**
 * Represents a section within a shop (e.g., "Sell" or "Buy").
 * - title: Title of the shop section.
 * - items: Items listed under this section, can include conditionals.
 */
export interface ShopSection {
    title: "Sell" | "Buy" | string;
    items: (ListItemElement | ConditionalBlock)[];
}

/**
 * Represents a sphere grid section.
 * - type: Specifies the block type as "sphereGrid".
 * - contextInfo: Optional context information for the sphere grid (e.g., character name, condition like "4 Return Spheres").
 * - content: Content of the sphere grid, can be character-specific actions, conditionals, images, or general list items.
 */
export interface SphereGridBlock {
    type: "sphereGrid";
    contextInfo?: string;
    content: (SphereGridCharacterActions | ConditionalBlock | ImageBlock | ListItemElement)[];
}

/**
 * Represents sphere grid actions for a specific character.
 * - type: Specifies the block type as "sphereGridCharacterActions".
 * - character: Name of the character whose grid is being modified.
 * - slvlInfo: Optional information about S.Levels required or gained.
 * - inlineCondition: Optional inline condition text (e.g., "If no OD").
 * - actions: Array of actions/steps on the grid, can include conditionals.
 * - associatedImages: Optional image associated with this character's grid segment.
 * - trackedResourceUpdates: Tracked resource updates (e.g., sphere consumption) for this entire grid segment.
 */
export interface SphereGridCharacterActions {
    type: "sphereGridCharacterActions";
    character: string;
    slvlInfo?: string;
    inlineCondition?: FormattedText[];
    actions: (ListItemElement | ConditionalBlock)[];
    associatedImages?: ImageBlock[];
    trackedResourceUpdates?: TrackedResource[];
}

/**
 * Represents a block detailing general encounter strategies for an area.
 * - type: Specifies the block type as "encounters".
 * - content: List items or conditional blocks detailing encounter strategies.
 * - notes: General notes for encounters in the area.
 * - trackedResourceUpdates: Tracked resources gained from general encounters in this area.
 * - itemAcquisitionFlags: Item flags relevant to general encounters in this area.
 */
export interface EncountersBlock {
    type: "encounters";
    content: (ListItemElement | ConditionalBlock)[];
    notes?: FormattedText[];
    trackedResourceUpdates?: TrackedResource[];
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/**
 * Represents a Cloister of Trials puzzle.
 * - type: Specifies the block type as "trial".
 * - steps: Array of steps to solve the trial.
 * - trackedResourceUpdates: Tracked resources gained from completing the trial.
 * - itemAcquisitionFlags: Item flags set upon completing the trial.
 */
export interface TrialBlock {
    type: "trial";
    steps: ListItemElement[];
    trackedResourceUpdates?: TrackedResource[];
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/**
 * Represents a Blitzball game.
 * - type: Specifies the block type as "blitzballGame".
 * - strategy: Array of strategy items for playing the Blitzball game.
 */
export interface BlitzballGameBlock {
    type: "blitzballGame";
    strategy: ListItemElement[];
}

/**
 * Represents an equipment setup or change.
 * - type: Specifies the block type as "equip".
 * - content: List items or conditional blocks detailing equipment changes.
 */
export interface EquipBlock {
    type: "equip";
    content: (ListItemElement | ConditionalBlock)[];
}

/**
 * Represents an image.
 * - type: Specifies the block type as "image".
 * - path: Path to the image file.
 * - width: Optional general width parameter (from \includegraphics).
 * - multiColumnWidth: Optional width for multi-column layout (from \sggraphics).
 * - singleColumnWidth: Optional width for single-column layout (from \sggraphics).
 */
export interface ImageBlock {
    type: "image";
    path: string;
    width?: string;
    multiColumnWidth?: string;
    singleColumnWidth?: string;
}

// --- Conditional Logic ---

/**
 * Represents one option within a multi-choice conditional block.
 * - conditionText: The text describing the condition for this option (e.g., "With Sleeping Powder:").
 * - content: The content (instructions, blocks) that applies if this option is chosen.
 */
export interface ConditionalOption {
    conditionText: string;
    content: (InlineElement | ChapterContent | ListItemElement)[];
}

/**
 * Represents a block of content that is displayed conditionally.
 * - type: Specifies the block type as "conditional".
 * - conditionSource: The source or type of the condition being evaluated.
 * - winContent: Content to display if the Blitzball result is "win" or the primary if/then condition is true.
 * - lossContent: Content to display if the Blitzball result is "loss" or the primary if/then condition is false.
 * - bothContent: Content to display if the Blitzball result is "both" (for LaTeX source that handles all three cases).
 * - displayAsItemizedCondition: If true, indicates the \blitzballdetermination was wrapped in an itemized condition like "\item \textit{If you won/lost blitz:}".
 * - options: Array of distinct conditional options the user can choose from or that describe different scenarios.
 * - textCondition: The textual representation of the "if..." part of the condition.
 * - thenContent: Content to display if the `textCondition` is met or evaluated as true.
 * - elseContent: Optional content to display if the `textCondition` is NOT met (for explicit "else" branches).
 * - resourceName: Name of the tracked resource to check (e.g., "Grenade").
 * - comparison: Type of comparison to perform.
 * - value: The value to compare the resource count against.
 * - contentToShowIfTrue: Content to display if the resource check condition is true.
 * - contentToShowIfFalse: Content to display if the resource check condition is false.
 * - flagName: The name or ID of the AcquiredItemFlag to check.
 * - thenContentForAll: For complex if/then/else structures in LaTeX that had a common "then" part after specific branches.
 * - additionalNote: One-off textual notes related to the conditional.
 * - notes: General notes for the entire conditional block.
 * - itemAcquisitionFlags: Item flags that might be set as a result of a choice within this conditional.
 */
export interface ConditionalBlock {
    type: "conditional";
    conditionSource:
    | "blitzballdetermination"
    | "ifthenelse_blitzresult"
    | "textual_direct_choice"
    | "textual_inline_if_then"
    | "textual_block_options"
    | "tracked_resource_check"
    | "acquired_item_flag_check";
    winContent?: (InlineElement | ChapterContent | ListItemElement)[];
    lossContent?: (InlineElement | ChapterContent | ListItemElement)[];
    bothContent?: (InlineElement | ChapterContent | ListItemElement)[];
    displayAsItemizedCondition?: boolean;
    options?: ConditionalOption[];
    textCondition?: FormattedText[];
    thenContent?: (InlineElement | ChapterContent | ListItemElement)[];
    elseContent?: (InlineElement | ChapterContent | ListItemElement)[];
    resourceName?: "PowerSphere" | "SpeedSphere" | "Grenade" | string;
    comparison?: "less_than" | "greater_than_or_equal_to" | "equals" | "not_equals";
    value?: number;
    contentToShowIfTrue?: (ListItemElement | CharacterCommand | ChapterContent)[];
    contentToShowIfFalse?: (ListItemElement | CharacterCommand | ChapterContent)[];
    flagName?: string;
    thenContentForAll?: (InlineElement | ChapterContent | ListItemElement)[];
    additionalNote?: string;
    notes?: FormattedText[];
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

// --- List Item and Inline Elements ---

/**
 * Represents a single item in a list (\item).
 * - type: Specifies the element type as "listItem".
 * - content: The main content of the list item, can be a mix of inline elements or nested block structures.
 * - trackedResourceUpdates: Optional resources updated by this list item (e.g., a \pickup command).
 * - itemAcquisitionFlags: Optional item flags set by this list item.
 * - subContent: Optional further indented sub-items or content not part of a formal nested list block.
 * - csrBehavior: Behavior of this item based on CSR mod status.
 * - csrNote: Optional note related to CSR behavior (e.g., "(Ignore if playing with CSR)").
 */
export interface ListItemElement {
    type: "listItem";
    content: (InlineElement | InstructionListBlock | ConditionalBlock | TextParagraphBlock | SphereGridBlock | EquipBlock | BattleBlock | EncountersBlock)[];
    trackedResourceUpdates?: TrackedResource[];
    itemAcquisitionFlags?: AcquiredItemFlag[];
    subContent?: (InlineElement | ChapterContent | ListItemElement)[];
    csrBehavior?: CSRBehavior;
    csrNote?: FormattedText[];
}

/**
 * A union of all possible inline (text-level) element types.
 * - PlainTextElement: Represents a segment of plain, unformatted text.
 * - FormattedText: Represents text with specific formatting (bold, italic, color, etc.).
 * - CharacterReference: Represents a reference to a game character, including styling.
 * - CharacterCommand: Represents a command or action performed by a character.
 * - GameMacro: Represents a common game macro/instruction (e.g., \sd, \cs).
 * - FormationElement: Represents a party formation.
 * - LinkElement: Represents a hyperlink.
 * - NthElement: Represents an ordinal number (e.g., 1st, 2nd).
 * - NumberElement: Represents a number formatted with \num{}.
 * - MathSymbolElement: Represents a mathematical symbol (e.g., arrows).
 */
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

/**
 * Represents a segment of plain, unformatted text.
 * - type: Specifies the element type as "plainText".
 * - text: The text content.
 */
export interface PlainTextElement {
    type: "plainText";
    text: string;
}

/**
 * Represents text with specific formatting (bold, italic, color, etc.).
 * - type: Specifies the element type as "formattedText".
 * - text: The text content.
 * - isBold: True if the text is bold.
 * - isItalic: True if the text is italicized.
 * - color: Optional color of the text.
 * - isLarge: True if the text is displayed in a larger font size.
 * - displayHint: Hint for special display, like centered headers.
 * - textDecoration: Text decoration, e.g., for links.
 */
export interface FormattedText {
    type: "formattedText";
    text: string;
    isBold?: boolean;
    isItalic?: boolean;
    color?: string;
    isLarge?: boolean;
    displayHint?: "centeredHeader";
    textDecoration?: "underline";
}

/**
 * Represents a reference to a game character, including styling.
 * - type: Specifies the element type as "characterReference".
 * - characterName: Name of the character being referenced (e.g., "Tidus", "Lulu", "Enemy", "Valefor").
 * - color: Optional color of the character reference.
 * - isBold: True if the character reference is bold.
 */
export interface CharacterReference {
    type: "characterReference";
    characterName: string;
    color?: string;
    isBold?: boolean;
}

/**
 * Represents a command or action performed by a character.
 * - type: Specifies the element type as "characterCommand".
 * - characterName: Name of the character performing the action.
 * - actionText: Text describing the action (e.g., "Attack", "Haste Yuna").
 * - color: Optional color of the action text.
 * - isBold: True if the action text is bold.
 * - subItems: For commands with further itemized details (e.g., Blitzball shot options).
 * - trackedResourceUpdates: Resources updated directly by this command.
 * - itemAcquisitionFlags: Item flags set directly by this command.
 */
export interface CharacterCommand {
    type: "characterCommand";
    characterName: string;
    actionText: string;
    color?: string;
    isBold?: boolean;
    subItems?: ListItemElement[];
    trackedResourceUpdates?: TrackedResource[];
    itemAcquisitionFlags?: AcquiredItemFlag[];
}

/**
 * Represents a common game macro/instruction (e.g., \sd, \cs).
 * - type: Specifies the element type as "gameMacro".
 * - macroName: Name of the macro (e.g., "sd", "cs", "fmv", "skippableFmv", "save", "pickup", "od").
 * - value: Optional value associated with the macro (e.g., time for \cs[3:40], item name for \pickup).
 */
export interface GameMacro {
    type: "gameMacro";
    macroName: "sd" | "cs" | "fmv" | "skippableFmv" | "save" | "pickup" | "od";
    value?: string;
}

/**
 * Represents a party formation.
 * - type: Specifies the element type as "formation".
 * - characters: Array of character references in the formation.
 */
export interface FormationElement {
    type: "formation";
    characters: CharacterReference[];
}

/**
 * Represents a hyperlink.
 * - type: Specifies the element type as "link".
 * - url: URL of the hyperlink.
 * - text: Array of formatted text elements representing the link text.
 */
export interface LinkElement {
    type: "link";
    url: string;
    text: FormattedText[];
}

/**
 * Represents an ordinal number (e.g., 1st, 2nd).
 * - type: Specifies the element type as "nth".
 * - value: The ordinal value (e.g., "1st", "2nd").
 */
export interface NthElement {
    type: "nth";
    value: string;
}

/**
 * Represents a number formatted with \num{}.
 * - type: Specifies the element type as "num".
 * - value: The numeric value.
 */
export interface NumberElement {
    type: "num";
    value: number;
}

/**
 * Represents a mathematical symbol (e.g., arrows).
 * - type: Specifies the element type as "mathSymbol".
 * - symbol: The symbol, either as raw LaTeX (e.g., "\leftarrow") or a pre-processed representation.
 */
export interface MathSymbolElement {
    type: "mathSymbol";
    symbol: string;
}