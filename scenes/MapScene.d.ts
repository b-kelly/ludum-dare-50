import { CustomScene } from "../objects/CustomScene";
export declare class MapScene extends CustomScene {
    static readonly KEY = "MapScene";
    constructor();
    init(data: object): void;
    preload(): void;
    create(): void;
    private drawHexMap;
    private drawHexagon;
}
