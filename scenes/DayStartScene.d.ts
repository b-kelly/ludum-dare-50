import { CustomScene } from "../objects/CustomScene";
import { EventOutcome } from "../objects/EventManager";
export declare class DayStartScene extends CustomScene {
    static readonly KEY = "DayStartScene";
    private eventOutcome;
    constructor();
    init(data: {
        eventOutcome: EventOutcome;
    }): void;
    preload(): void;
    create(): void;
    private createResourcesDisplay;
}
