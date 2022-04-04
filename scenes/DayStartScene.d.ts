import { CustomScene } from "../objects/CustomScene";
export declare class DayStartScene extends CustomScene {
    static readonly KEY = "DayStartScene";
    constructor();
    init(): void;
    preload(): void;
    create(): void;
    private generateRow;
    private getDisplayText;
}
