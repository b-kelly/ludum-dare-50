import { CustomScene } from "../objects/CustomScene";
export declare class ExploreScene extends CustomScene {
    static readonly KEY = "ExploreScene";
    private map;
    private tileMap;
    constructor();
    init(data: object): void;
    preload(): void;
    create(): void;
}
