import { WorldMap } from "./WorldMap/WorldMap";
export interface Resources {
    fuel: number;
    food: number;
    water: number;
    parts: number;
    filters: number;
}
interface CampaignStats {
    dayCount: number;
    dailyHauls: Resources[];
}
/** Handy wrapper around our shared data */
export declare class GlobalDataStore {
    private scene;
    constructor(scene: Phaser.Scene);
    get resources(): Readonly<Resources>;
    get worldMap(): WorldMap;
    get campaignStats(): CampaignStats;
    get currentDay(): Resources;
    addResourceToHaul(key: keyof Resources, count: number): void;
    endDay(): void;
    expendMoveResources(amtToExpend: number): boolean;
    private updateResources;
    private getOrCreate;
}
export {};
