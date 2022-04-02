import { CustomScene } from "../objects/CustomScene";
export declare class ExploreScene extends CustomScene {
    static readonly KEY = "ExploreScene";
    private map;
    private tileMap;
    private player;
    constructor();
    init(data: object): void;
    preload(): void;
    create(): void;
    update(): void;
    private translateCoord;
}
