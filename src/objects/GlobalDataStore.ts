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
} as const;

export interface Resources {
    fuel: number;
    food: number;
    water: number;
    parts: number;
    filters: number;
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
        return this.getOrCreate("worldMap", () => {
            console.log("creating new WorldMap");
            return new WorldMap();
        });
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

        // TODO replenish daily fuel here or after showing stats?
        this.updateResources({
            food: haul.food + res.food,
            fuel: haul.fuel + res.fuel,
            water: haul.water + res.water,
            parts: haul.parts + res.parts,
            filters: haul.filters + res.filters,
        });

        const stats = this.campaignStats;
        stats.dayCount += 1;
        stats.dailyProgress.push({
            haul: haul,
            events: curr.events,
        });

        this.scene.registry.set("campaignStats", stats);
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
