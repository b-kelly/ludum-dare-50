import { CellType, Cell } from "./shared";

export const MAP_WIDTH = 31;
export const MAP_HEIGHT = 31;

const cellTypeSpawnData: Record<
    CellType,
    {
        spawnRate: number;
        clusterSizeUpper: number;
        clusterSizeLower: number;
    }
> = {
    [CellType.Empty]: null,
    [CellType.Colony]: null,
    [CellType.Forest]: {
        spawnRate: 0.025,
        clusterSizeUpper: 3,
        clusterSizeLower: 1,
    },
    [CellType.Desert]: {
        spawnRate: 0.025,
        clusterSizeUpper: 3,
        clusterSizeLower: 1,
    },
    [CellType.Wetland]: {
        spawnRate: 0.025,
        clusterSizeUpper: 3,
        clusterSizeLower: 1,
    },
} as const;

export const WorldAssets = {
    tiles: "tiles",
    // which row each tileset is on
    tilesData: {
        [CellType.Forest]: 0,
        [CellType.Wetland]: 1,
        [CellType.Desert]: 2,
        [CellType.Empty]: 3,
        [CellType.Colony]: 4,
        Overlay: 5,
    },
} as const;

export class WorldMap {
    private _cells: Cell[][];
    private playerHomeCoords: { x: number; y: number };
    private currentPlayerCoords: { x: number; y: number };

    // TODO Deep ReadOnly?
    get cells(): ReadonlyArray<ReadonlyArray<Readonly<Cell>>> {
        return this._cells;
    }

    get playerCoords(): Readonly<WorldMap["currentPlayerCoords"]> {
        return { ...this.currentPlayerCoords };
    }

    constructor() {
        this.currentPlayerCoords = {
            x: Math.floor(MAP_WIDTH / 2),
            y: Math.floor(MAP_HEIGHT / 2),
        };
        this.playerHomeCoords = { ...this.playerCoords };
        this._cells = this.generateMap();
        this.setPlayerPosition(
            this.currentPlayerCoords.x,
            this.currentPlayerCoords.y
        );
    }

    getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    getAdjacentCells(px: number, py: number) {
        return [
            // top/bottom
            { x: px, y: py - 1 },
            { x: px, y: py + 1 },
            // left row
            { x: px - 1, y: py },
            { x: px - 1, y: py + 1 },
            // right row
            { x: px + 1, y: py },
            { x: px + 1, y: py + 1 },
        ];
    }

    getPlayerAdjacentCells() {
        const { x, y } = this.playerCoords;
        return this.getAdjacentCells(x, y);
    }

    cellIsAdjacentToPlayer(x: number, y: number) {
        const px = this.currentPlayerCoords.x;
        const py = this.currentPlayerCoords.y;

        // the current cell is not adjacent
        if (x === px && y === py) {
            return false;
        }

        // check above and below
        if (x === px) {
            if (y === px - 1 || y === px + 1) {
                return true;
            }
        }

        // check upper left/right
        if (y === py) {
            if (x === px - 1 || x === px + 1) {
                return true;
            }
        }

        // check lower left/right
        if (y === py + 1) {
            if (x === px - 1 || x === px + 1) {
                return true;
            }
        }

        return false;
    }

    setPlayerPosition(x: number, y: number) {
        this.currentPlayerCoords = { x, y };
        this._cells[y][x].playerHasVisited = true;
    }

    private generateMap() {
        type GenCell = Cell & { _visited: boolean };
        const map: GenCell[][] = [];

        for (let y = 0; y < MAP_HEIGHT; y++) {
            map[y] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                const cellType = this.pickCellType();
                map[y][x] = {
                    _visited: cellType !== CellType.Empty,
                    // randomly distribute seeds
                    type: cellType,
                    clearedFogOfWar: false,
                    playerHasVisited: false,
                    // TODO pickEvent
                };
            }
        }

        // go through and grow the seeds
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const cell = map[y][x];

                if (cell.type !== CellType.Empty) {
                    const meta = cellTypeSpawnData[cell.type];
                    const count = Phaser.Math.RND.integerInRange(
                        meta.clusterSizeLower,
                        meta.clusterSizeUpper
                    );

                    // cluster size of one means just this cell
                    if (count > 1) {
                        for (let i = 0; i < count; i++) {
                            const neighbor = this.getRandomAdjacentCell(
                                map,
                                x,
                                y
                            ) as GenCell;

                            if (neighbor && !neighbor._visited) {
                                neighbor.type = cell.type;
                                neighbor._visited = true;
                            }
                        }
                    }
                }
            }
        }

        // TODO make sure colonies are spaced apart?
        // generate exactly twelve colonies
        for (let i = 0; i < 12; i++) {
            const rx = Phaser.Math.RND.integerInRange(0, MAP_WIDTH - 1);
            const ry = Phaser.Math.RND.integerInRange(0, MAP_HEIGHT - 1);

            map[ry][rx].type = CellType.Colony;
        }

        // set the player home to a colony tile as well
        map[this.playerHomeCoords.y][this.playerHomeCoords.x].type =
            CellType.Colony;

        return map;
    }

    private getRandomAdjacentCell(map: Cell[][], x: number, y: number) {
        const rx = Phaser.Math.RND.integerInRange(-1, 1);
        const ry = Phaser.Math.RND.integerInRange(-1, 1);

        const newX = x + rx;
        const newY = y + ry;

        if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) {
            return null;
        }

        return map[newY][newX];
    }

    private pickCellType() {
        let ret = CellType.Empty;

        Object.entries(cellTypeSpawnData).forEach(([key, data]) => {
            if (!data) {
                return true;
            }

            const rng = Phaser.Math.RND.frac();
            if (rng <= data.spawnRate) {
                ret = +key;
                return false;
            }

            // proceed to the next type
            return true;
        });

        return ret;
    }

    public DEBUG_displayMap(): void {
        const display = document.querySelector<HTMLCanvasElement>(".js-map");
        display.classList.remove("hide-debug");
        const map = this._cells;

        const ctx = display.getContext("2d");
        const width = 10;
        const scale = 4; // increase this to make the display physically larger, scaling the canvas view to match
        const ctxScale = (1 / width) * scale;

        display.width = MAP_WIDTH * scale;
        display.height = MAP_HEIGHT * scale;
        ctx.scale(ctxScale, ctxScale);

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const cell = map[i][j];
                switch (cell.type) {
                    case CellType.Empty:
                        ctx.fillStyle = "white";
                        break;
                    case CellType.Colony:
                        ctx.fillStyle = "black";
                        break;
                    case CellType.Desert:
                        ctx.fillStyle = "yellow";
                        break;
                    case CellType.Forest:
                        ctx.fillStyle = "green";
                        break;
                    case CellType.Wetland:
                        ctx.fillStyle = "blue";
                        break;
                    default:
                        ctx.fillStyle = "black";
                }

                ctx.fillRect(i * width, j * width, width, width);
            }
        }

        // draw the player start pos
        ctx.fillStyle = "hotpink";
        const playerWidth = width / 2; // show some of the square behind the player for debugging
        ctx.fillRect(
            this.currentPlayerCoords.x * width + playerWidth / 2,
            this.currentPlayerCoords.y * width + playerWidth / 2,
            playerWidth,
            playerWidth
        );
    }
}
