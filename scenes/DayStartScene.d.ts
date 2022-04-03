import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
export declare class DayStartScene extends CustomScene {
    static readonly KEY = "DayStartScene";
    private eventMessage;
    private eventModifiers;
    constructor();
    init(data: {
        eventMessage: string;
        eventModifiers: Resources;
    }): void;
    preload(): void;
    create(): void;
    private createResourcesDisplay;
}
