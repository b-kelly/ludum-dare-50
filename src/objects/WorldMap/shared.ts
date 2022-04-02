export enum CellType {
    Empty = 0,
    Colony = 1,
    Forest = 2,
    Desert = 3,
    Wetland = 4,
}

export interface Cell {
    type: CellType;
    clearedFogOfWar: boolean;
}
