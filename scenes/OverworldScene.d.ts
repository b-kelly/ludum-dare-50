import { CustomScene } from "../objects/CustomScene";
export declare class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";
    private player;
    constructor();
    init(data: object): void;
    preload(): void;
    create(): void;
    private drawHexMap;
    private updateMap;
    private movePlayerToCoord;
    private updatePlayerAdjacentCells;
    private getCell;
    private selectSquare;
    private createAnimations;
}
