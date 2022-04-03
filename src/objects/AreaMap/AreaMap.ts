import { Resources } from "../GlobalDataStore";
import { CellType } from "../WorldMap/shared";
import { AreaSpriteSheet } from "./AreaSpriteSheet";

export enum CellState {
    Open,
    Filled,
    Wall,
    Resource,
}

const resourceSpawnRate: Record<CellType, Record<keyof Resources, number>> = {
    [CellType.Colony]: null,
    [CellType.Empty]: null,
    [CellType.Desert]: {
        fuel: 0.01,
        food: 0.01,
        water: 0.01,
        filters: 0.01,
        parts: 0.01,
    },
    [CellType.Forest]: {
        fuel: 0.01,
        food: 0.01,
        water: 0.01,
        filters: 0.01,
        parts: 0.01,
    },
    [CellType.Wetland]: {
        fuel: 0.01,
        food: 0.01,
        water: 0.01,
        filters: 0.01,
        parts: 0.01,
    },
} as const;

/** Generates a connected "cave" with cellular automata */
export class AreaMap {
    private _map: CellState[][] = [];
    private readonly _size: { width: number; height: number };
    private readonly _startLocation: { x: number; y: number };
    private readonly _cellType: CellType;

    private readonly chanceToStartOpen = 0.4;
    //private readonly chanceToGenerateResource = 0.01;
    private readonly requiredNeighborsForLife = 4;
    private readonly requiredNeighborsForBirth = 3;
    private readonly iterations = 4;

    get map(): CellState[][] {
        return this._map;
    }

    get size(): { width: number; height: number } {
        return this._size;
    }

    get startLocation(): { x: number; y: number } {
        return this._startLocation;
    }

    constructor(width: number, height: number, type: CellType) {
        this._size = { width, height };
        this._cellType = type;
        this._map = this.generateMap();
        this._startLocation = this.findSuitableStartLocation(this._map);
    }

    /** Tile map expects this backwards from how we're rendering it */
    toTilemap(sheet: AreaSpriteSheet): CellState[][] {
        const tilemap = [];
        for (let i = 0; i < this._size.width; i++) {
            tilemap[i] = [];
            for (let j = 0; j < this._size.height; j++) {
                const currentCell = this._map[j][i];
                // TODO re-randomizes the tile sprites every time the scene launches
                const randomSpriteFrame =
                    sheet.getRandomFrameByType(currentCell);

                tilemap[i][j] = randomSpriteFrame;
            }
        }

        return tilemap;
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
        const map: CellState[][] = [];
        // init an empty map with random cells burrowed out
        for (let i = 0; i < this._size.width; i++) {
            map[i] = [];
            for (let j = 0; j < this._size.height; j++) {
                map[i][j] =
                    Math.random() < this.chanceToStartOpen
                        ? CellState.Open
                        : CellState.Filled;
            }
        }

        return map;
    }

    /** Get the count of open neighbors around a given cell */
    private getOpenNeighbors(map: CellState[][], x: number, y: number) {
        let openNeighbors = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                const xNeighbor = x + i;
                const yNeighbor = y + j;

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
                else if (map[xNeighbor][yNeighbor] === CellState.Open) {
                    openNeighbors += 1;
                }
            }
        }
        return openNeighbors;
    }

    /** Runs a single cellular automata simulation step on a map */
    private runSimulationStep(currentMap: CellState[][]) {
        const newMap: CellState[][] = [];
        for (let i = 0; i < this._size.width; i++) {
            newMap[i] = [];
            for (let j = 0; j < this._size.height; j++) {
                // check how many neighbors this cell has
                const openNeighbors = this.getOpenNeighbors(currentMap, i, j);

                // live cells stay alive if they have enough neighbors
                if (currentMap[i][j] === CellState.Open) {
                    newMap[i][j] =
                        openNeighbors >= this.requiredNeighborsForLife
                            ? CellState.Open
                            : CellState.Filled;
                } else {
                    // dead cells come alive if they have enough neighbors
                    newMap[i][j] =
                        openNeighbors > this.requiredNeighborsForBirth
                            ? CellState.Open
                            : CellState.Filled;
                }
            }
        }

        return newMap;
    }

    /** Mark all the cavern walls in place, placing resources on them if able */
    private markWallsAndPlaceResources(map: CellState[][]) {
        const spawnRates = resourceSpawnRate[this._cellType] || {};
        const entries = Object.entries(spawnRates);

        // run through each cell mark it as a wall if it has any open neighbors
        for (let i = 0; i < this._size.width; i++) {
            for (let j = 0; j < this._size.height; j++) {
                const cell = map[i][j];
                if (
                    cell === CellState.Filled &&
                    this.getOpenNeighbors(map, i, j) > 0
                ) {
                    map[i][j] = CellState.Wall;
                } else if (cell === CellState.Open) {
                    entries.forEach((kv) => {
                        if (Phaser.Math.RND.frac() <= kv[1]) {
                            map[i][j] = CellState.Resource; // TODO SPECIFIC RESOURCE
                            return false;
                        }
                    });
                }
            }
        }
    }

    /** Finds an open space near the bottom middle of the map for the player to spawn */
    private findSuitableStartLocation(map: CellState[][]) {
        const middle = Math.floor(this._size.width / 2);
        for (let i = this._size.height - 1; i >= 0; i--) {
            for (let j = 0, len = this.size.width / 2; j < len; j++) {
                // look to the left/right of the middle for an open cell
                const left = middle - j;
                const right = middle + j;

                if (left >= 0 && map[left][i] === CellState.Open) {
                    return { x: left, y: i };
                }

                if (
                    right < this._size.width &&
                    map[right][i] === CellState.Open
                ) {
                    return { x: right, y: i };
                }

                // else - we didn't find an open cell, so move on to the next row up
            }
        }
    }

    public DEBUG_displayMap(): void {
        const display = document.querySelector<HTMLCanvasElement>(".js-map");
        display.classList.remove("hide-debug");
        const map = this.map;

        const ctx = display.getContext("2d");
        const width = 10;
        const scale = 4; // increase this to make the display physically larger, scaling the canvas view to match
        const ctxScale = (1 / width) * scale;

        display.width = this.size.width * scale;
        display.height = this.size.height * scale;
        ctx.scale(ctxScale, ctxScale);

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const cell = map[i][j];
                switch (cell) {
                    case CellState.Open:
                        ctx.fillStyle = "white";
                        break;
                    case CellState.Wall:
                        ctx.fillStyle = "grey";
                        break;
                    // case CellState.Resource:
                    //     ctx.fillStyle = "red";
                    //     break;
                    default:
                        ctx.fillStyle = "black";
                }

                ctx.fillRect(i * width, j * width, width, width);
            }
        }

        // draw the player start pos
        ctx.fillStyle = "green";
        const playerWidth = width / 2; // show some of the square behind the player for debugging
        ctx.fillRect(
            this.startLocation.x * width + playerWidth / 2,
            this.startLocation.y * width + playerWidth / 2,
            playerWidth,
            playerWidth
        );
    }
}
