import { CustomScene } from "./CustomScene";
import { Resources } from "./GlobalDataStore";
import { CellBiome } from "./WorldMap/shared";
/**
 * none - can happen any time
 * daily - only happens on daily review
 * map - only happens as a random map event
 */
declare type EventType = "none" | "daily" | "map" | "colony";
declare type EventCharacter = "none" | "kiran" | "adzo" | "shreya" | "kamal" | "lufti" | "rupert" | "harish" | "annika" | "gaston" | "martin" | "britt" | "girish" | "sachin" | "chip" | "dora" | "marcel";
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
    /** morning message for split events */
    morningMessage?: string;
    /** fail message for condition events */
    failMessage?: string;
    /** event can only be called once */
    unique?: boolean;
    /** the specific character that is speaking */
    character?: EventCharacter;
    resourceDelta?: Partial<Resources>;
    upgrade?: {
        resource: keyof Resources | "playerHp";
        type: "replenishment" | "capacity";
        delta: number;
    };
    conditions?: {
        coloniesFound?: number;
        biome?: CellBiome;
        onDay?: number;
        resource?: {
            type: keyof Resources;
            trigger: "few" | "many";
        };
        tilesVisited?: number;
    };
}
export interface EventOutcome {
    message: string;
    resourceDelta: Partial<Resources>;
    upgrade: GameEvent["upgrade"];
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
    /**
     *
     * @param event    conditions?: {
        coloniesFound?: number;
        biome?: CellBiome;
        onDay?: number;
        resource?: {
            type: keyof Resources;
            trigger: "few" | "many";
        };
        tilesVisited?: number;
    };
     */
    private checkMiscConditions;
    private events;
}
export {};
