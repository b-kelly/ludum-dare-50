declare enum CellType {
    Unknown = 0
}
interface Cell {
    type: CellType;
}
export declare class WorldMap {
    private _cells;
    get cells(): ReadonlyArray<ReadonlyArray<Readonly<Cell>>>;
    constructor();
    private generateMap;
}
export {};
