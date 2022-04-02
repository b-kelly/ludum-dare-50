import { CustomScene } from "../objects/CustomScene";
export declare class BaseScene extends CustomScene {
    static readonly KEY = "BaseScene";
    constructor();
    init(data: object): void;
    preload(): void;
    create(): void;
    private createResourcesDisplay;
}
