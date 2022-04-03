import { GameEvent } from "./EventManager";
import { WorldMap } from "./WorldMap/WorldMap";

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
} as const;

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
export class GlobalDataStore {
    constructor(private scene: Phaser.Scene) {}

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
        }));
    }

    get campaignStats() {
        return this.getOrCreate<CampaignStats>("campainStats", () => ({
            dayCount: 0,
            dailyProgress: [],
        }));
    }

    get currentDay(): CurrentDay {
        return this.getOrCreate<CurrentDay>("currentDay", () => ({
            haul: {
                fuel: 0,
                food: 0,
                water: 0,
                parts: 0,
                filters: 0,
            },
            events: [],
        }));
    }

    logEvent(event: GameEvent) {
        const curr = this.currentDay;
        curr.events.push(event);

        this.scene.registry.set("currentDay", curr);
    }

    adjustHaul(delta: Partial<Resources>) {
        const curr = this.currentDay;

        Object.keys(delta).forEach((k: keyof Resources) => {
            curr.haul[k] += delta[k];
        });

        this.scene.registry.set("currentDay", curr);
    }

    endDay() {
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
        stats.dailyProgress.push({
            haul: haul,
            events: curr.events,
        });

        this.scene.registry.set("campaignStats", stats);
        this.scene.registry.remove("currentDay");
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
