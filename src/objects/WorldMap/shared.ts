export type CellBiome = "default" | "forest" | "wetland" | "desert";

export type CellType = "empty" | "event" | "explorable" | "colony";

export interface Cell {
    type: CellType;
    biome: CellBiome;
    clearedFogOfWar: boolean;
    playerHasVisited: boolean;
    randomSpriteFrame: number;
}

export const TILES_SHEET_WIDTH = 3;
