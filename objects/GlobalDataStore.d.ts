import { GameEvent } from "./EventManager";
import { WorldMap } from "./WorldMap/WorldMap";
export declare type GameOverType = "resource" | "time" | null;
export interface Resources {
    fuel: number;
    food: number;
    water: number;
    parts: number;
    filters: number;
}
interface BaseStatus {
    maxStorage: Resources;
    dailyReplenish: Resources;
}
interface CurrentDay {
    haul: Resources;
    events: GameEvent[];
}
interface CampaignStats {
    dayCount: number;
    dailyProgress: CurrentDay[];
}
/** Handy wrapper around our shared data */
export declare class GlobalDataStore {
    private scene;
    constructor(scene: Phaser.Scene);
    get resources(): Readonly<Resources>;
    get worldMap(): WorldMap;
    get baseStatus(): BaseStatus;
    get campaignStats(): CampaignStats;
    get currentDay(): CurrentDay;
    logEvent(event: GameEvent): void;
    adjustHaul(delta: Partial<Resources>): void;
    /** @returns true if a gameover was triggered */
    endDay(): GameOverType;
    expendMoveResources(amtToExpend: number): boolean;
    private updateResources;
    private getOrCreate;
}
export {};
