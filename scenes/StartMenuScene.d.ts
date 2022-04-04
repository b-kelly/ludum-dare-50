import { CustomScene } from "../objects/CustomScene";
export declare class StartMenuScene extends CustomScene {
    static readonly KEY = "StartMenuScene";
    constructor();
    preload(): void;
    create(): void;
    private launchGame;
    private DEBUG_ACTIONS;
}
