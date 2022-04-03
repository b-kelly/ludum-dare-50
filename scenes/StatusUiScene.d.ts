import { CustomScene } from "../objects/CustomScene";
export declare const STATUS_UI_HEIGHT = 64;
export declare class StatusUiScene extends CustomScene {
    static readonly KEY = "StatusUiScene";
    private text;
    constructor();
    preload(): void;
    create(): void;
}
