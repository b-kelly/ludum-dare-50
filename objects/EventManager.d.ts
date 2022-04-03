import { CustomScene } from "./CustomScene";
import { Resources } from "./GlobalDataStore";
/**
 * none - can happen any time
 * daily - only happens on daily review
 * map - only happens as a random map event
 */
declare type EventType = "none" | "daily" | "map" | "colony";
export interface GameEvent {
    type: EventType;
    shortDescriptor: string;
    message: string;
    resourceDelta: Partial<Resources>;
    upgrades?: unknown;
}
export interface EventOutcome {
    message: string;
    resourceDelta: Partial<Resources>;
    resourcesPrior: Resources;
    gameOver: boolean;
}
export declare class EventManager {
    private scene;
    constructor(scene: CustomScene);
    spawnDailyEvent(): EventOutcome;
    spawnMapEvent(): EventOutcome;
    spawnColonyEvent(): EventOutcome;
    private spawnEvent;
    private applyEvent;
    private chooseEvent;
}
export {};