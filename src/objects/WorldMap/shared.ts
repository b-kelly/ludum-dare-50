export enum CellBiome {
    Empty = 0,
    Colony = 1,
    Forest = 2,
    Desert = 3,
    Wetland = 4,
}

export interface Cell {
    biome: CellBiome;
    clearedFogOfWar: boolean;
    playerHasVisited: boolean;
}
