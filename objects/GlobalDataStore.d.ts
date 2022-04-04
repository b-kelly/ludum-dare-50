import { CustomScene } from "./CustomScene";
import { GameEvent } from "./EventManager";
import { CellType } from "./WorldMap/shared";
import { WorldMap } from "./WorldMap/WorldMap";
export declare type GameOverType = "resource" | "tiles" | "colonies" | null;
export interface Resources {
    filters: number;
    food: number;
    fuel: number;
    panels: number;
    parts: number;
    water: number;
}
export interface BaseStatus {
    maxStorage: Resources;
    dailyReplenish: Resources;
    fuelCostVisitedTile: number;
    fuelCostUnvisitedTile: number;
    fuelCostPerScan: number;
    maxPlayerHp: number;
}
interface CurrentDay {
    colonyCount: number;
    haul: Resources;
    events: GameEvent[];
    tilesVisited: number;
    tilesExplored: number;
    dailyEvent: GameEvent;
}
export interface CampaignStats {
    dayCount: number;
    colonyCount: number;
    dailyProgress: CurrentDay[];
}
/** Handy wrapper around our shared data */
export declare class GlobalDataStore {
    private scene;
    constructor(scene: CustomScene);
    get resources(): Readonly<Resources>;
    get worldMap(): WorldMap;
    get baseStatus(): BaseStatus;
    get campaignStats(): CampaignStats;
    get currentDay(): CurrentDay;
    get playerHp(): number;
    damagePlayer(value: number): boolean;
    setDailyEvent(event: GameEvent): void;
    logEvent(event: GameEvent): void;
    logTileVisit(type: CellType): void;
    logTileExploration(): void;
    adjustHaul(delta: Partial<Resources>): void;
    upgradeBase(upgrade: GameEvent["upgrade"]): void;
    startDay(): GameEvent;
    /** @returns true if a gameover was triggered */
    endDay(): GameOverType;
    expendMoveResources(amtToExpend: number): boolean;
    expendScanResources(): boolean;
    private updateResources;
    private getOrCreate;
}
export {};
