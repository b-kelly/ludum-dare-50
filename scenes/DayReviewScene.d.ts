import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
export declare class DayReviewScene extends CustomScene {
    static readonly KEY = "DayReviewScene";
    private dailyHaul;
    private dailyEventOutcome;
    constructor();
    init(data: {
        dailyHaul: Resources;
    }): void;
    preload(): void;
    create(): void;
    private sleepAndStartNextDay;
    private generateRow;
}
