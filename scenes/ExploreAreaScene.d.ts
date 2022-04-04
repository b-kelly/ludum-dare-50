import { CustomScene } from "../objects/CustomScene";
import { Cell } from "../objects/WorldMap/shared";
export declare class ExploreAreaScene extends CustomScene {
    static readonly KEY = "ExploreAreaScene";
    private map;
    private tileMap;
    private biome;
    private player;
    private creatures;
    constructor();
    init(data: Cell): void;
    preload(): void;
    create(): void;
    update(time: number): void;
    private spawnResources;
    private leaveArea;
    private translateCoord;
    private createAnimations;
}
