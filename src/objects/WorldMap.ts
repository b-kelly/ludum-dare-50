const MAP_WIDTH = 30;
const MAP_HEIGHT = 30;

// TODO
enum CellType {
    Unknown,
}

interface Cell {
    type: CellType;
}
export class WorldMap {
    private _cells: Cell[][];

    // TODO Deep ReadOnly?
    get cells(): ReadonlyArray<ReadonlyArray<Readonly<Cell>>> {
        return this._cells;
    }

    constructor() {
        this._cells = this.generateMap();
    }

    private generateMap() {
        const map: Cell[][] = [];

        for (let y = 0; y < MAP_HEIGHT; y++) {
            map[y] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                map[y][x] = {
                    type: CellType.Unknown,
                };
            }
        }

        return map;
    }
}
