import { CustomScene } from "./CustomScene";
import { GameEvent } from "./EventManager";
import { CellType } from "./WorldMap/shared";
import { WorldMap } from "./WorldMap/WorldMap";

export type GameOverType = "resource" | "tiles" | null;
const GAME_OVER_TILES_COUNT = 50; // How many visited tiles it takes to get a "game success"

const startingValues = {
    resources: {
        fuel: 10,
        food: 10,
        water: 10,
        parts: 10,
        filters: 10,
    },
    maxStorage: {
        fuel: 10,
        food: 15,
        water: 15,
        parts: 10,
        filters: 10,
    },
    dailyReplenish: {
        fuel: 10,
        food: 1,
        water: 1,
        parts: 0,
        filters: 0,
    },
    fuelCostVisitedTile: 1,
    fuelCostUnvisitedTile: 2,
} as const;

export interface Resources {
    fuel: number;
    food: number;
    water: number;
    parts: number;
    filters: number;
}

export interface BaseStatus {
    maxStorage: Resources;
    dailyReplenish: Resources;
    fuelCostVisitedTile: number;
    fuelCostUnvisitedTile: number;
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
    /* NOTE: we don't keep track of total tiles visited/explored as those are better calculated from the map itself */
}

/** Handy wrapper around our shared data */
export class GlobalDataStore {
    constructor(private scene: CustomScene) {}

    get resources(): Readonly<Resources> {
        return this.getOrCreate<Resources>(
            "resources",
            () => startingValues.resources
        );
    }

    get worldMap(): WorldMap {
        return this.getOrCreate("worldMap", () => new WorldMap());
    }

    get baseStatus(): BaseStatus {
        return this.getOrCreate("baseStatus", () => ({
            maxStorage: startingValues.maxStorage,
            dailyReplenish: startingValues.dailyReplenish,
            fuelCostUnvisitedTile: startingValues.fuelCostUnvisitedTile,
            fuelCostVisitedTile: startingValues.fuelCostVisitedTile,
        }));
    }

    get campaignStats() {
        return this.getOrCreate<CampaignStats>("campainStats", () => ({
            dayCount: 0,
            colonyCount: 0,
            dailyProgress: [],
        }));
    }

    get currentDay(): CurrentDay {
        return this.getOrCreate<CurrentDay>("currentDay", () => ({
            colonyCount: 0,
            haul: {
                fuel: 0,
                food: 0,
                water: 0,
                parts: 0,
                filters: 0,
            },
            events: [],
            tilesExplored: 0,
            tilesVisited: 0,
            dailyEvent: null,
        }));
    }

    setDailyEvent(event: GameEvent) {
        const curr = this.currentDay;
        curr.dailyEvent = event;
        this.scene.registry.set("currentDay", curr);
    }

    logEvent(event: GameEvent) {
        const curr = this.currentDay;
        curr.events.push(event);

        this.scene.registry.set("currentDay", curr);
    }

    logTileVisit(type: CellType) {
        const curr = this.currentDay;
        if (type === "colony") {
            curr.colonyCount += 1;
        } else {
            curr.tilesVisited += 1;
        }
        this.scene.registry.set("currentDay", curr);
    }

    logTileExploration() {
        const curr = this.currentDay;
        curr.tilesExplored += 1;
        this.scene.registry.set("currentDay", curr);
    }

    adjustHaul(delta: Partial<Resources>) {
        if (!delta) {
            return;
        }

        const curr = this.currentDay;

        Object.keys(delta).forEach((k: keyof Resources) => {
            curr.haul[k] += delta[k];
        });

        this.scene.registry.set("currentDay", curr);
    }

    startDay(): GameEvent {
        return this.scene.eventManager.chooseAndSetDailyEvent();
    }

    /** @returns true if a gameover was triggered */
    endDay(): GameOverType {
        const curr = this.currentDay;
        const haul = curr.haul;
        const res = this.resources;
        const stat = this.baseStatus;

        this.updateResources({
            food: Math.min(
                haul.food + res.food + stat.dailyReplenish.food,
                stat.maxStorage.food
            ),
            fuel: Math.min(
                haul.fuel + res.fuel + stat.dailyReplenish.fuel,
                stat.maxStorage.fuel
            ),
            water: Math.min(
                haul.water + res.water + stat.dailyReplenish.water,
                stat.maxStorage.water
            ),
            parts: Math.min(
                haul.parts + res.parts + stat.dailyReplenish.parts,
                stat.maxStorage.parts
            ),
            filters: Math.min(
                haul.filters + res.filters + stat.dailyReplenish.filters,
                stat.maxStorage.filters
            ),
        });

        const stats = this.campaignStats;
        stats.dayCount += 1;
        stats.colonyCount += curr.colonyCount;
        stats.dailyProgress.push({
            colonyCount: curr.colonyCount,
            haul: haul,
            events: curr.events,
            tilesExplored: 0,
            tilesVisited: 0,
            dailyEvent: null,
        });

        this.scene.registry.set("campaignStats", stats);
        this.scene.registry.remove("currentDay");

        // check if any resource dropped below zero
        const resources = this.resources;
        for (const k of Object.keys(resources)) {
            const val = resources[k as keyof Resources];
            if (val <= 0) {
                return "resource";
            }
        }

        // check for gameover due to visiting lots of tiles
        const tileStats = this.worldMap.getPlayerCellStats();
        if (tileStats.visited >= GAME_OVER_TILES_COUNT) {
            return "tiles";
        }

        return null;
    }

    expendMoveResources(amtToExpend: number) {
        const res = this.resources;
        if (res.fuel - amtToExpend < 0) {
            return false;
        }

        this.updateResources({
            ...res,
            fuel: res.fuel - amtToExpend,
        });

        return true;
    }

    private updateResources(resources: Resources) {
        this.scene.registry.set("resources", resources);
    }

    private getOrCreate<T>(key: string, defaultVal: () => T): T {
        let ret = this.scene.registry.get(key) as T;

        if (typeof ret === "undefined") {
            ret = defaultVal();

            this.scene.registry.set(key, ret);
        }

        return ret;
    }
}
