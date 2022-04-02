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
        readonly Overlay: 5;
    };
};
export declare class WorldMap {
    private _cells;
    private playerHomeCoords;
    private currentPlayerCoords;
    get cells(): ReadonlyArray<ReadonlyArray<Readonly<Cell>>>;
    get playerCoords(): Readonly<WorldMap["currentPlayerCoords"]>;
    constructor();
    getAdjacentCells(px: number, py: number): {
        x: number;
        y: number;
    }[];
    getPlayerAdjacentCells(): {
        x: number;
        y: number;
    }[];
    cellIsAdjacentToPlayer(x: number, y: number): boolean;
    setPlayerPosition(x: number, y: number): void;
    private generateMap;
    private getRandomAdjacentCell;
    private pickCellType;
    DEBUG_displayMap(): void;
}
export declare class WorldCell extends Phaser.GameObjects.Sprite {
    private overlay;
    private hasFogOfWar;
    private currentState;
    private prevState;
    constructor(scene: CustomScene, xIndex: number, yIndex: number, cell: Cell);
    setCellState(state: {
        isVisitable?: boolean;
        clearFogOfWar?: boolean;
    }): void;
    private setOverlayState;
    private initEventListeners;
    private hover;
    static genName(x: number, y: number): string;
    private static getRandomSpriteFrame;
}
export declare class WorldPlayer extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number);
}
export {};
