import { Cell } from "./shared";
export declare const MAP_WIDTH = 31;
export declare const MAP_HEIGHT = 31;
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
    getCell(x: number, y: number): Readonly<Cell>;
    getPlayerCell(): Cell & {
        x: number;
        y: number;
    };
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
