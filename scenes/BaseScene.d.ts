import { CustomScene } from "../objects/CustomScene";
export declare class BaseScene extends CustomScene {
    static readonly KEY = "BaseScene";
    private isDay;
    constructor();
    init(data: {
        isDay: boolean;
    }): void;
    preload(): void;
    create(): void;
    private createResourcesDisplay;
}
