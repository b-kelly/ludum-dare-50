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

interface Resources {
    fuel: number;
    food: number;
    water: number;
    parts: number;
    filters: number;
}

interface CampaignStats {
    dayCount: number;
    dailyHauls: Resources[]; //TODO track daily losses?
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
            dailyHauls: [],
        }));
    }

    get currentDay(): Resources {
        return this.getOrCreate<Resources>("currentDay", () => ({
            fuel: 0,
            food: 0,
            water: 0,
            parts: 0,
            filters: 0,
        }));
    }

    addResourceToHaul(key: keyof Resources, count: number) {
        const curr = this.currentDay;
        curr[key] += count;

        this.scene.registry.set("currentDay", curr);
    }

    endDay() {
        const curr = this.currentDay;
        const res = this.resources;

        // TODO replenish daily fuel here or after showing stats?
        this.updateResources({
            food: curr.food + res.food,
            fuel: curr.fuel + res.fuel,
            water: curr.water + res.water,
            parts: curr.parts + res.parts,
            filters: curr.filters + res.filters,
        });

        const stats = this.campaignStats;
        stats.dayCount += 1;
        stats.dailyHauls.push(curr);

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
