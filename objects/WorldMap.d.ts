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
    clearedFogOfWar: boolean;
}
export declare const WorldAssets: {
    readonly tiles: "tiles";
    readonly tilesData: {
        readonly 2: 0;
        readonly 4: 1;
        readonly 3: 2;
        readonly 0: 3;
        readonly 1: 4;
    };
};
export declare class WorldMap {
    private _cells;
    private currentPlayerCoords;
    get cells(): ReadonlyArray<ReadonlyArray<Readonly<Cell>>>;
    get playerCoords(): Readonly<WorldMap["currentPlayerCoords"]>;
    constructor();
    cellIsAdjacentToPlayer(x: number, y: number): boolean;
    private generateMap;
    private getRandomAdjacentCell;
    private pickCellType;
    DEBUG_displayMap(): void;
}
export declare class WorldCell extends Phaser.GameObjects.Sprite {
    private overlay;
    private hasFogOfWar;
    constructor(scene: CustomScene, xIndex: number, yIndex: number, cell: Cell);
    setCellState(state: {
        isVisitable?: boolean;
        clearFogOfWar?: boolean;
    }): void;
    private setOverlayState;
    private initEventListeners;
    private hover;
    private static getRandomSpriteFrame;
}
export declare class WorldPlayer extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number);
}
export {};
