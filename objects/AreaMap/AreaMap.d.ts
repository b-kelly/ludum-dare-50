export declare enum CellState {
    Open = 0,
    Filled = 1,
    Wall = 2,
    Resource = 3
}
/**
 * 64x64 grid
 * for each subsection
 * 1 top-left corner
 * 2 top edge next to path
 * 3-4 interior
 * 4-5 path
 * 5-6 2x2 statement pieces (fills in interior)
 * 7 filler objects (fills in interior)
 *
 * randomly rotate interior tiles
 * path tiles rotate
 */
/** Generates a connected "cave" with cellular automata */
export declare class AreaMap {
    private _map;
    private readonly _size;
    private readonly _startLocation;
    private readonly chanceToStartOpen;
    private readonly chanceToGenerateResource;
    private readonly requiredNeighborsForLife;
    private readonly requiredNeighborsForBirth;
    private readonly iterations;
    get map(): CellState[][];
    get size(): {
        width: number;
        height: number;
    };
    get startLocation(): {
        x: number;
        y: number;
    };
    constructor(width: number, height: number);
    /** Tile map expects this backwards from how we're rendering it */
    toTilemap(): CellState[][];
    /** Completely generates a cave */
    private generateMap;
    /** Initializes a map with seed cells placed */
    private initializeMap;
    /** Get the count of open neighbors around a given cell */
    private getOpenNeighbors;
    /** Runs a single cellular automata simulation step on a map */
    private runSimulationStep;
    /** Mark all the cavern walls in place, placing resources on them if able */
    private markWallsAndPlaceResources;
    /** Finds an open space near the bottom middle of the map for the player to spawn */
    private findSuitableStartLocation;
    DEBUG_displayMap(): void;
}
