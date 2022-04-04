import { CellBiome, Cell, CellType, TILES_SHEET_WIDTH } from "./shared";

export const MAP_WIDTH = 31;
export const MAP_HEIGHT = 31;

type GenCell = Cell & { _visited: boolean };

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
        spawnRate: 0.075,
        clusterSizeUpper: 3,
        clusterSizeLower: 1,
    },
    desert: {
        spawnRate: 0.025,
        clusterSizeUpper: 20,
        clusterSizeLower: 10,
    },
    wetland: {
        spawnRate: 0.05,
        clusterSizeUpper: 8,
        clusterSizeLower: 5,
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
        desert: 1,
        wetland: 2,
        Overlay: 3,
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

    getAdjacentCellCoords(px: number, py: number) {
        const mod = px % 2 == 0 ? 1 : 0;

        return [
            // top/bottom
            { x: px, y: py - 1 },
            { x: px, y: py + 1 },
            // left row
            { x: px - 1, y: py - mod },
            { x: px - 1, y: py - mod + 1 },
            // right row
            { x: px + 1, y: py - mod },
            { x: px + 1, y: py - mod + 1 },
        ];
    }

    getAdjacentCells(map: GenCell[][], px: number, py: number) {
        const coords = this.getAdjacentCellCoords(px, py);
        const cells: GenCell[] = [];

        coords.forEach(({ x, y }) => {
            if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
                return;
            }

            cells.push(map[y][x]);
        });

        return cells;
    }

    getPlayerAdjacentCellCoords() {
        const { x, y } = this.playerCoords;
        return this.getAdjacentCellCoords(x, y);
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

    markCellExplored(x: number, y: number) {
        this.getCell(x, y).playerHasExplored = true;
    }

    clearFogOfWar(x: number, y: number) {
        this.getCell(x, y).clearedFogOfWar = true;
    }

    getPlayerCellStats() {
        const ret = {
            visited: 0,
            explored: 0,
        };

        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const cell = this._cells[y][x];
                ret.visited += Number(cell.playerHasVisited);
                ret.explored += Number(cell.playerHasExplored);
            }
        }

        return ret;
    }

    private generateMap() {
        const map: GenCell[][] = [];

        for (let y = 0; y < MAP_HEIGHT; y++) {
            map[y] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                // randomly distribute seeds and special cells
                const cellBiome = this.pickCellBiome();
                const cellType = this.pickCellType();

                map[y][x] = {
                    _visited: false,
                    biome: cellBiome,
                    type: cellType,
                    clearedFogOfWar: false,
                    playerHasVisited: false,
                    playerHasExplored: false,
                    randomSpriteFrame: 0, // assigned below
                };

                this.assignBiomeType(map[y][x], cellBiome, cellType);
            }
        }

        // go through and grow the seeds, clean up empty areas, etc
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                // fill in any empty areas
                this.fillDefaultCell(map, x, y);

                // grow any non-empty areas
                this.growSeed(map, x, y);
            }
        }

        // one more time, fill in any leftover default cells
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                // fill in any empty areas
                this.fillDefaultCell(map, x, y);
            }
        }

        // TODO make sure colonies are spaced apart?
        // TODO divide the map into 4/5/4 sections and place one colony randomly within (except the middle/spawn)
        // generate exactly twelve colonies
        for (let i = 0; i < 12; i++) {
            const rx = Phaser.Math.RND.integerInRange(0, MAP_WIDTH - 1);
            const ry = Phaser.Math.RND.integerInRange(0, MAP_HEIGHT - 1);

            const cell = map[ry][rx];
            cell.type = "colony";
            this.assignBiomeType(cell, cell.biome, cell.type);
        }

        // set the player home to a colony tile as well
        const cell = map[this.playerHomeCoords.y][this.playerHomeCoords.x];
        cell.type = "colony";
        this.assignBiomeType(cell, cell.biome, cell.type);

        return map;
    }

    private growSeed(map: GenCell[][], x: number, y: number, currentCount = 0) {
        const cell = map[y][x];

        // we don't want to grow the default biome / already grown cells
        if (cell.biome === "default" || cell._visited) {
            return;
        }

        const meta = cellBiomeSpawnData[cell.biome];
        const count = Phaser.Math.RND.integerInRange(
            meta.clusterSizeLower,
            meta.clusterSizeUpper
        );

        // cluster size of one means just this cell
        if (count <= 1) {
            return;
        }

        for (let i = 0; i < count; i++) {
            const neighbor = this.getRandomAdjacentCell(map, x, y)?.cell;

            if (neighbor && !neighbor._visited) {
                this.assignBiomeType(neighbor, cell.biome, neighbor.type);
                neighbor._visited = true;
                currentCount += 1;
            }
        }

        // if we still have room to grow the cluster, pick a neighbor and spread
        if (currentCount < count) {
            let neighbor: ReturnType<WorldMap["getRandomAdjacentCell"]> = null;

            // TODO can this loop infinitely?
            while (!neighbor) {
                neighbor = this.getRandomAdjacentCell(map, x, y);
            }

            neighbor.cell._visited = false;
            this.growSeed(
                map,
                neighbor.coords.x,
                neighbor.coords.y,
                currentCount
            );
        }
    }

    private fillDefaultCell(map: GenCell[][], x: number, y: number) {
        const cell = map[y][x];

        // don't fill non-empty cells
        if (cell.biome !== "default") {
            return;
        }

        // try to match a neighbor cell if possible
        const neighbors = this.getAdjacentCells(map, x, y);
        for (const neighbor of neighbors) {
            if (neighbor && neighbor.biome !== "default") {
                this.assignBiomeType(cell, neighbor.biome, cell.type);
                cell._visited = true;
                break;
            }
        }

        // if no neighber had a type to steal, add an unvisited seed (so it can grow in the next step)
        if (cell.biome === "default") {
            this.assignBiomeType(cell, this.pickCellBiome(), cell.type);
        }
    }

    private getRandomAdjacentCell(map: GenCell[][], x: number, y: number) {
        const rx = Phaser.Math.RND.integerInRange(-1, 1);
        const ry = Phaser.Math.RND.integerInRange(-1, 1);

        const newX = x + rx;
        const newY = y + ry;

        if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) {
            return null;
        }

        return { cell: map[newY][newX], coords: { x: newX, y: newY } };
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

    /*
     * Legend [Empty], [C]olony, [Random]
     * Sprite sheet looks like:
     * ECRRR
     * ECRRR
     * ECRRR
     * xxx
     * Row 0 forest, row 1 wetlands, row 2 desert
     */
    private getRandomSpriteFrame(biome: CellBiome, type: CellType) {
        if (biome === "default") {
            return 0; // TODO this can get called during initial map creation
        }

        const row = WorldAssets.tilesData[biome];

        const startIndex = row * TILES_SHEET_WIDTH;

        // there's one empty sprite per biome - use that exact sprite
        if (type === "empty") {
            return startIndex;
        }

        // ditto for colony
        if (type === "colony") {
            return startIndex + 1;
        }

        // three random tiles to choose from
        const rng = Phaser.Math.RND.integerInRange(0, 2);

        return startIndex + 2 + rng;
    }

    private assignBiomeType(cell: Cell, biome: CellBiome, type: CellType) {
        cell.biome = biome;
        cell.randomSpriteFrame = this.getRandomSpriteFrame(biome, type);
    }

    public DEBUG_displayMap(): void {
        const display = document.querySelector<HTMLCanvasElement>(".js-map");
        display.classList.remove("hide-debug");
        const map = this._cells;

        const ctx = display.getContext("2d");
        const width = 10;
        const scale = 8; // increase this to make the display physically larger, scaling the canvas view to match
        const ctxScale = (1 / width) * scale;

        display.width = MAP_WIDTH * scale;
        display.height = MAP_HEIGHT * scale;
        ctx.scale(ctxScale, ctxScale);

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const cell = map[i][j];
                switch (cell.biome) {
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
                    switch (cell.type) {
                        case "event":
                            ctx.fillStyle = "gold";
                            break;
                        case "colony":
                            ctx.fillStyle = "black";
                            break;
                        case "explorable":
                        default:
                            ctx.fillStyle = "silver";
                    }
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
        ctx.fillStyle = "black";
        ctx.strokeRect(
            this.currentPlayerCoords.x * width,
            this.currentPlayerCoords.y * width,
            width,
            width
        );
    }
}
