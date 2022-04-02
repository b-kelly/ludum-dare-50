import { CustomScene } from "../objects/CustomScene";
export declare class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";
    private player;
    constructor();
    init(data: object): void;
    preload(): void;
    create(): void;
    private drawHexMap;
    private selectSquare;
}
