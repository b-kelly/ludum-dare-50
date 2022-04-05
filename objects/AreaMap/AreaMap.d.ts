import { Resources } from "../GlobalDataStore";
import { CellBiome } from "../WorldMap/shared";
import { AreaSpriteSheet } from "./AreaSpriteSheet";
export declare enum CellState {
    Open = 0,
    Filled = 1,
    Wall = 2
}
interface AreaCell {
    state: CellState;
    resource?: keyof Resources | "enemy";
    rotation?: number;
    wallType?: "wall" | "corner";
    fillType?: "regular" | "small" | "large";
}
/** Generates a connected "cave" with cellular automata */
export declare class AreaMap {
    private _map;
    private readonly _size;
    private readonly _startLocation;
    private readonly _cellType;
    private readonly chanceToStartOpen;
    private readonly requiredNeighborsForLife;
    private readonly requiredNeighborsForBirth;
    private readonly iterations;
    private readonly fillCavernsSmallerThan;
    private readonly tunnelIfMoreThanNeighborCount;
    get map(): AreaCell[][];
    get size(): {
        width: number;
        height: number;
    };
    get startLocation(): {
        x: number;
        y: number;
    };
    constructor(width: number, height: number, type: CellBiome);
    /** Tile map expects this backwards from how we're rendering it */
    toTilemap(sheet: AreaSpriteSheet): AreaCell[][];
    getResources(): {
        resource: keyof Resources | "enemy";
        x: number;
        y: number;
    }[];
    /** Completely generates a cave */
    private generateMap;
    /** Initializes a map with seed cells placed */
    private initializeMap;
    private getAllNeighborsWhere;
    private getOpenNeighborCoords;
    /** Get the count of open neighbors around a given cell */
    private getOpenNeighbors;
    /** Runs a single cellular automata simulation step on a map */
    private runSimulationStep;
    /** Mark all the cavern walls in place, placing resources on them if able */
    private markWallsAndPlaceResources;
    private determineWallType;
    /** Finds an open space near the middle of the map for the player to spawn */
    private findSuitableStartLocation;
    private detectAndAlterCaverns;
    DEBUG_displayMap(): void;
}
export {};
