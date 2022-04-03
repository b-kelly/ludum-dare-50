import { CustomScene } from "../objects/CustomScene";
export declare class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";
    private player;
    private movingTowardsCoords;
    private exploreButton;
    constructor();
    preload(): void;
    create(): void;
    update(): void;
    private exploreCell;
    private returnToCamp;
    private selectSquare;
    private drawHexMap;
    private movePlayerAndUpdateCells;
    private movePlayerToCoord;
    private updatePlayerAdjacentCells;
    private getCell;
    private canExploreCell;
    private createAnimations;
}
