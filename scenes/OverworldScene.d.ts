import { CustomScene } from "../objects/CustomScene";
export declare class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";
    private player;
    private movingTowardsCoords;
    constructor();
    init(): void;
    preload(): void;
    create(): void;
    update(): void;
    private exploreCell;
    private returnToCamp;
    private drawHexMap;
    private updateMap;
    private movePlayerToCoord;
    private updatePlayerAdjacentCells;
    private getCell;
    private selectSquare;
    private createAnimations;
}
