import { CustomScene } from "./CustomScene";
declare enum CellType {
    Empty = 0,
    Colony = 1,
    Forest = 2,
    Desert = 3,
    Wetland = 4
}
interface Cell {
    type: CellType;
}
export declare class WorldMap {
    private _cells;
    private currentPlayerCoords;
    get cells(): ReadonlyArray<ReadonlyArray<Readonly<Cell>>>;
    get playerCoords(): Readonly<WorldMap["currentPlayerCoords"]>;
    constructor();
    cellIsAdjacentToPlayer(x: number, y: number): boolean;
    private generateMap;
    private pickCellType;
    DEBUG_displayMap(): void;
}
export declare class WorldCell extends Phaser.GameObjects.Polygon {
    private prevFillStyle;
    constructor(scene: CustomScene, xIndex: number, yIndex: number, cell: Cell);
    private initEventListeners;
    private hover;
}
export declare class WorldPlayer extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number);
}
export {};
