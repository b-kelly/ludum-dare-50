import { Resources } from "../GlobalDataStore";
import { CellBiome } from "../WorldMap/shared";
import { AreaSpriteSheet } from "./AreaSpriteSheet";

export enum CellState {
    Open,
    Filled,
    Wall,
}

interface AreaCell {
    state: CellState;
    resource?: keyof Resources;
    rotation?: number;
}

const resourceSpawnRate: Record<CellBiome, Record<keyof Resources, number>> = {
    default: null,
    desert: {
        fuel: 0.01,
        food: 0.01,
        water: 0.01,
        filters: 0.01,
        parts: 0.01,
    },
    forest: {
        fuel: 0.01,
        food: 0.01,
        water: 0.01,
        filters: 0.01,
        parts: 0.01,
    },
    wetland: {
        fuel: 0.01,
        food: 0.01,
        water: 0.01,
        filters: 0.01,
        parts: 0.01,
    },
} as const;

/** Generates a connected "cave" with cellular automata */
export class AreaMap {
    private _map: AreaCell[][] = [];
    private readonly _size: { width: number; height: number };
    private readonly _startLocation: { x: number; y: number };
    private readonly _cellType: CellBiome;

    private readonly chanceToStartOpen = 0.4;
    //private readonly chanceToGenerateResource = 0.01;
    private readonly requiredNeighborsForLife = 4;
    private readonly requiredNeighborsForBirth = 3;
    private readonly iterations = 4;

    get map(): AreaCell[][] {
        return this._map;
    }

    get size(): { width: number; height: number } {
        return this._size;
    }

    get startLocation(): { x: number; y: number } {
        return this._startLocation;
    }

    constructor(width: number, height: number, type: CellBiome) {
        this._size = { width, height };
        this._cellType = type;
        this._map = this.generateMap();
        this._startLocation = this.findSuitableStartLocation(this._map);
    }

    /** Tile map expects this backwards from how we're rendering it */
    toTilemap(sheet: AreaSpriteSheet): AreaCell[][] {
        const tilemap = [];
        for (let x = 0; x < this._size.width; x++) {
            tilemap[x] = [];
            for (let y = 0; y < this._size.height; y++) {
                const currentCell = this._map[y][x];
                // TODO re-randomizes the tile sprites every time the scene launches
                const randomSpriteFrame = sheet.getRandomFrameByType(
                    currentCell.state
                );

                tilemap[x][y] = randomSpriteFrame;
            }
        }

        return tilemap;
    }

    getResources() {
        const resources = [];

        for (let y = 0; y < this._size.height; y++) {
            for (let x = 0; x < this._size.width; x++) {
                if (this._map[y][x].resource) {
                    resources.push({
                        resource: this._map[y][x].resource,
                        x,
                        y,
                    });
                }
            }
        }

        return resources;
    }

    /** Completely generates a cave */
    private generateMap() {
        let map = this.initializeMap();
        for (let i = 0; i < this.iterations; i++) {
            map = this.runSimulationStep(map);
        }

        // identify caverns and walls
        this.markWallsAndPlaceResources(map);

        return map;
    }

    /** Initializes a map with seed cells placed */
    private initializeMap() {
        const map: AreaCell[][] = [];
        // init an empty map with random cells burrowed out
        for (let y = 0; y < this._size.height; y++) {
            map[y] = [];
            for (let x = 0; x < this._size.width; x++) {
                map[y][x] = {
                    state:
                        Phaser.Math.RND.frac() < this.chanceToStartOpen
                            ? CellState.Open
                            : CellState.Filled,
                };
            }
        }

        return map;
    }

    /** Get the count of open neighbors around a given cell */
    private getOpenNeighbors(map: AreaCell[][], px: number, py: number) {
        let openNeighbors = 0;
        for (let y = -1; y < 2; y++) {
            for (let x = -1; x < 2; x++) {
                if (x == 0 && y == 0) {
                    continue;
                }
                const xNeighbor = px + x;
                const yNeighbor = py + y;

                // consider neighbors that are off the map as "filled"
                if (
                    xNeighbor < 0 ||
                    yNeighbor < 0 ||
                    xNeighbor >= this._size.width ||
                    yNeighbor >= this._size.height
                ) {
                    continue;
                }

                // if this neighbor is open, increment the count
                else if (map[yNeighbor][xNeighbor].state === CellState.Open) {
                    openNeighbors += 1;
                }
            }
        }
        return openNeighbors;
    }

    /** Runs a single cellular automata simulation step on a map */
    private runSimulationStep(currentMap: AreaCell[][]) {
        const newMap: AreaCell[][] = [];
        for (let y = 0; y < this._size.height; y++) {
            newMap[y] = [];
            for (let x = 0; x < this._size.width; x++) {
                // check how many neighbors this cell has
                const openNeighbors = this.getOpenNeighbors(currentMap, x, y);

                // live cells stay alive if they have enough neighbors
                if (currentMap[y][x].state === CellState.Open) {
                    newMap[y][x] = {
                        state:
                            openNeighbors >= this.requiredNeighborsForLife
                                ? CellState.Open
                                : CellState.Filled,
                    };
                } else {
                    // dead cells come alive if they have enough neighbors
                    newMap[y][x] = {
                        state:
                            openNeighbors > this.requiredNeighborsForBirth
                                ? CellState.Open
                                : CellState.Filled,
                    };
                }
            }
        }

        return newMap;
    }

    /** Mark all the cavern walls in place, placing resources on them if able */
    private markWallsAndPlaceResources(map: AreaCell[][]) {
        const spawnRates = resourceSpawnRate[this._cellType] || {};
        const entries = Object.entries(spawnRates);

        // run through each cell mark it as a wall if it has any open neighbors
        for (let y = 0; y < this._size.height; y++) {
            for (let x = 0; x < this._size.width; x++) {
                const cell = map[y][x];
                if (
                    cell.state === CellState.Filled &&
                    this.getOpenNeighbors(map, x, y) > 0
                ) {
                    map[y][x] = {
                        state: CellState.Wall,
                    };
                } else if (cell.state === CellState.Open) {
                    entries.forEach((kv) => {
                        if (Phaser.Math.RND.frac() <= kv[1]) {
                            map[y][x].resource = kv[0] as keyof Resources;
                            return false;
                        }
                    });
                }
            }
        }
    }

    /** Finds an open space near the middle of the map for the player to spawn */
    private findSuitableStartLocation(map: AreaCell[][]) {
        const xMid = Math.floor(this._size.width / 2);
        const yMid = Math.floor(this._size.height / 2);

        // the center cell is open, so use it
        if (map[yMid][xMid].state === CellState.Open) {
            return { x: xMid, y: yMid };
        }

        let currentX = xMid;
        let currentY = yMid;

        // start searching the cells around the center point, roughly increasing the radius as we go
        for (let y = 1; y < yMid; y++) {
            for (let x = 1; x < xMid; x++) {
                // UGH look at this nasty copy/paste job

                // left
                currentX = xMid - x;
                currentY = yMid;
                let cell = map[currentY][currentX];
                if (cell?.state === CellState.Open) {
                    return { x: currentX, y: currentY };
                }

                //right
                currentX = xMid + x;
                currentY = yMid;
                cell = map[currentY][currentX];
                if (cell?.state === CellState.Open) {
                    return { x: currentX, y: currentY };
                }

                //up
                currentX = xMid;
                currentY = yMid - y;
                cell = map[currentY][currentX];
                if (cell?.state === CellState.Open) {
                    return { x: currentX, y: currentY };
                }

                //down
                currentX = xMid;
                currentY = yMid + y;
                cell = map[currentY][currentX];
                if (cell?.state === CellState.Open) {
                    return { x: currentX, y: currentY };
                }
            }
        }

        // no empty cells found? just crash as this should never happen
        throw "Cannot spawn player - no empty cells found";
    }

    public DEBUG_displayMap(): void {
        const display = document.querySelector<HTMLCanvasElement>(".js-map");
        display.classList.remove("hide-debug");
        const map = this.map;

        const ctx = display.getContext("2d");
        const width = 10;
        const scale = 8; // increase this to make the display physically larger, scaling the canvas view to match
        const ctxScale = (1 / width) * scale;

        display.width = this.size.width * scale;
        display.height = this.size.height * scale;
        ctx.scale(ctxScale, ctxScale);

        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                const cell = map[y][x];
                switch (cell.state) {
                    case CellState.Open:
                        ctx.fillStyle = "white";
                        break;
                    case CellState.Wall:
                        ctx.fillStyle = "grey";
                        break;
                    default:
                        ctx.fillStyle = "black";
                }

                ctx.fillRect(y * width, x * width, width, width);

                if (cell.resource) {
                    switch (cell.resource) {
                        case "food":
                            ctx.fillStyle = "green";
                            break;
                        case "water":
                            ctx.fillStyle = "blue";
                            break;
                        case "filters":
                            ctx.fillStyle = "red";
                            break;
                        case "parts":
                            ctx.fillStyle = "hotpink";
                            break;
                        case "fuel":
                        default:
                            ctx.fillStyle = "purple";
                    }
                }

                ctx.fillRect(y * width, x * width, width, width);
            }
        }

        // draw the player start pos
        ctx.fillStyle = "gold";
        ctx.fillRect(
            this.startLocation.x * width,
            this.startLocation.y * width,
            width,
            width
        );
    }
}
