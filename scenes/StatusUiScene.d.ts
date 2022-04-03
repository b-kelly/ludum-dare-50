import { CustomScene } from "../objects/CustomScene";
export declare class StatusUiScene extends CustomScene {
    static readonly KEY = "StatusUiScene";
    private fuelText;
    constructor();
    preload(): void;
    create(): void;
    update(): void;
    private updateHud;
    private getFuelText;
}
