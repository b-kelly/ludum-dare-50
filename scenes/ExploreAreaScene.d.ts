import { CustomScene } from "../objects/CustomScene";
export declare class ExploreAreaScene extends CustomScene {
    static readonly KEY = "ExploreAreaScene";
    private map;
    private tileMap;
    private currentCell;
    private player;
    constructor();
    init(data: ExploreAreaScene["currentCell"]): void;
    preload(): void;
    create(): void;
    update(): void;
    private leaveArea;
    private translateCoord;
    private createAnimations;
}
