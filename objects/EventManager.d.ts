import { CustomScene } from "./CustomScene";
import { Resources } from "./GlobalDataStore";
export interface GameEvent {
    shortDescriptor: string;
    message: string;
    resourceDelta: Partial<Resources>;
}
export interface EventOutcome {
    message: string;
    resourceDelta: Partial<Resources>;
    resourcesPrior: Resources;
}
export declare class EventManager {
    private scene;
    constructor(scene: CustomScene);
    spawnDailyEvent(): EventOutcome;
    private applyEvent;
    private chooseEvent;
}
