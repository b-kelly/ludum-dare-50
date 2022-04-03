import { CellBiome, Cell, CellType, TILES_SHEET_WIDTH } from "./shared";

export const MAP_WIDTH = 31;
export const MAP_HEIGHT = 31;

const cellBiomeSpawnData: Record<
    CellBiome,
    {
        spawnRate: number;
        clusterSizeUpper: number;
        clusterSizeLower: number;
    }
> = {
    default: null,
    forest: {
        spawnRate: 0.025,
        clusterSizeUpper: 3,
        clusterSizeLower: 1,
    },
    desert: {
        spawnRate: 0.025,
        clusterSizeUpper: 3,
        clusterSizeLower: 1,
    },
    wetland: {
        spawnRate: 0.025,
        clusterSizeUpper: 3,
        clusterSizeLower: 1,
    },
} as const;

const cellTypeSpawnData: Record<CellType, number> = {
    empty: null,
    event: 0.1,
    explorable: 0.45,
    colony: null,
} as const;

export const WorldAssets = {
    tiles: "tiles",
    // which row each tileset is on
    tilesData: {
        forest: 0,
        wetland: 1,
        desert: 2,
        Empty: 3,
        Colony: 4,
        Overlay: 5,
        default: 5, //TODO need sprites for these
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
        return this._cells[y][x];
    }

    getPlayerCell(): Cell & { x: number; y: number } {
        const cell = this.getCell(this.playerCoords.x, this.playerCoords.y);

        return {
            ...cell,
            ...this.playerCoords,
        };
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
        this.getCell(x, y).playerHasVisited = true;
    }

    private generateMap() {
        type GenCell = Cell & { _visited: boolean };
        const map: GenCell[][] = [];

        for (let y = 0; y < MAP_HEIGHT; y++) {
            map[y] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                // randomly distribute seeds and special cells
                const cellBiome = this.pickCellBiome();
                const cellType = this.pickCellType();
                const spriteFrame = this.getRandomSpriteFrame(
                    cellBiome,
                    cellType
                );

                map[y][x] = {
                    _visited: cellBiome !== "default",
                    biome: cellBiome,
                    clearedFogOfWar: false,
                    playerHasVisited: false,
                    type: cellType,
                    randomSpriteFrame: spriteFrame,
                };
            }
        }

        // go through and grow the seeds
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const cell = map[y][x];

                if (cell.biome !== "default") {
                    const meta = cellBiomeSpawnData[cell.biome];
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
                                neighbor.biome = cell.biome;
                                neighbor.randomSpriteFrame =
                                    this.getRandomSpriteFrame(
                                        neighbor.biome,
                                        neighbor.type
                                    );
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

            map[ry][rx].type = "colony";
        }

        // set the player home to a colony tile as well
        map[this.playerHomeCoords.y][this.playerHomeCoords.x].type = "colony";

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

    private pickCellBiome() {
        let ret: CellBiome = "default";

        for (const [key, data] of Object.entries(cellBiomeSpawnData)) {
            if (!data) {
                continue;
            }

            const rng = Phaser.Math.RND.frac();
            if (rng <= data.spawnRate) {
                ret = key as CellBiome;
                break;
            }
        }
        return ret;
    }

    private pickCellType() {
        let ret: CellType = "empty";

        Object.entries(cellTypeSpawnData).forEach(([key, data]) => {
            if (!data) {
                return true;
            }

            const rng = Phaser.Math.RND.frac();
            if (rng <= data) {
                ret = key as CellType;
                return false;
            }

            // proceed to the next type
            return true;
        });

        return ret;
    }

    private getRandomSpriteFrame(biome: CellBiome, type: CellType) {
        // there's one empty sprite per biome - use that exact sprite
        if (biome !== "default" && type === "empty") {
            let spriteIndex = WorldAssets.tilesData.Empty * TILES_SHEET_WIDTH;
            // forest = 0, wetland = 1, desert = 2
            if (biome === "wetland") {
                spriteIndex += 1;
            } else if (biome === "desert") {
                spriteIndex += 2;
            }

            return spriteIndex;
        }

        // ditto for colony
        if (biome !== "default" && type === "colony") {
            let spriteIndex = WorldAssets.tilesData.Colony * TILES_SHEET_WIDTH;
            // forest = 0, wetland = 1, desert = 2
            if (biome === "wetland") {
                spriteIndex += 1;
            } else if (biome === "desert") {
                spriteIndex += 2;
            }

            return spriteIndex;
        }

        let row = 0;

        if (biome === "forest") {
            row = 0;
        } else if (biome === "wetland") {
            row = 1;
        } else if (biome === "desert") {
            row = 2;
        } else if (biome === "default") {
            row = 5;
        }

        const startIndex = row * TILES_SHEET_WIDTH;

        // TODO don't have sprites for default yet, so just use the white overlay ¯\_(ツ)_/¯
        if (biome === "default") {
            return startIndex;
        }

        const rng = Phaser.Math.RND.integerInRange(0, TILES_SHEET_WIDTH - 1);

        return startIndex + rng;
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
                switch (cell.biome) {
                    // case "Colony":
                    //     ctx.fillStyle = "black";
                    //     break;
                    case "desert":
                        ctx.fillStyle = "brown";
                        break;
                    case "forest":
                        ctx.fillStyle = "green";
                        break;
                    case "wetland":
                        ctx.fillStyle = "blue";
                        break;
                    case "default":
                    default:
                        ctx.fillStyle = "white";
                }

                ctx.fillRect(i * width, j * width, width, width);

                if (cell.type !== "empty") {
                    ctx.fillStyle = cell.type === "event" ? "gold" : "silver";
                    ctx.fillRect(
                        i * width + width / 4,
                        j * width + width / 4,
                        width / 2,
                        width / 2
                    );
                }
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
