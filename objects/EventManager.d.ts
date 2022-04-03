import { CustomScene } from "./CustomScene";
import { Resources } from "./GlobalDataStore";
import { CellBiome } from "./WorldMap/shared";
/**
 * none - can happen any time
 * daily - only happens on daily review
 * map - only happens as a random map event
 */
declare type EventType = "none" | "daily" | "map" | "colony";
export interface JsonSchema {
    colony: GameEvent[];
    onDay: GameEvent[];
    resource: GameEvent[];
    random: GameEvent[];
}
export interface GameEvent {
    type: EventType;
    shortDescriptor: string;
    /** general use message - evening/success message for split/condition events */
    message: string;
    /** event can only be called once */
    unique?: boolean;
    /** morning message for split events */
    morningMessage?: string;
    /** fail message for condition events */
    failMessage?: string;
    resourceDelta?: Partial<Resources>;
    upgrades?: unknown;
    conditions?: {
        coloniesFound?: number;
        biome?: CellBiome;
        onDay?: number;
        resource?: {
            type: keyof Resources;
            trigger: "few" | "many";
        };
    };
}
export interface EventOutcome {
    message: string;
    resourceDelta: Partial<Resources>;
    resourcesPrior: Resources;
    /** event caused a game over */
    gameOver: boolean;
    /** two part event was a success? */
    eventPassed?: boolean;
}
export declare class EventManager {
    private scene;
    constructor(scene: CustomScene);
    chooseAndSetDailyEvent(): GameEvent;
    completeDailyEvent(): EventOutcome;
    spawnDailyEvent(): EventOutcome;
    spawnMapEvent(): EventOutcome;
    spawnColonyEvent(): EventOutcome;
    private spawnEvent;
    private applyEvent;
    private chooseEvent;
    private checkResourceCondition;
    private events;
}
export {};
