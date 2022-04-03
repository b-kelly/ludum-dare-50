export declare type CellBiome = "default" | "forest" | "wetland" | "desert";
export declare type CellType = "empty" | "event" | "explorable" | "colony";
export interface Cell {
    type: CellType;
    biome: CellBiome;
    clearedFogOfWar: boolean;
    playerHasVisited: boolean;
    randomSpriteFrame: number;
}
export declare const TILES_SHEET_WIDTH = 3;
