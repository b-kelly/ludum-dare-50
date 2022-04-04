import { CustomScene } from "./CustomScene";
import { GameEvent } from "./EventManager";
import { CellType } from "./WorldMap/shared";
import { WorldMap } from "./WorldMap/WorldMap";

export type GameOverType = "resource" | "tiles" | "colonies" | null;
const GAME_OVER_TILES_COUNT = 80; // How many visited tiles it takes to get a "game success"
const COLONY_COUNT = 12;

const startingValues = {
    resources: {
        filters: 5,
        food: 10,
        fuel: 10,
        panels: 5,
        parts: 5,
        water: 10,
    },
    maxStorage: {
        filters: 20,
        food: 30,
        fuel: 20,
        panels: 20,
        parts: 20,
        water: 30,
    },
    dailyReplenish: {
        filters: -2,
        food: -5,
        fuel: 10,
        panels: -2,
        parts: -2,
        water: -5,
    },
    fuelCostVisitedTile: 1,
    fuelCostUnvisitedTile: 2,
    fuelCostPerScan: 2,
    playerHp: 5,
} as const;

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
            fuelCostPerScan: startingValues.fuelCostPerScan,
            maxPlayerHp: startingValues.playerHp,
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
                panels: 0,
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

    get playerHp() {
        return this.getOrCreate<number>(
            "playerHp",
            () => startingValues.playerHp
        );
    }

    damagePlayer(value: number) {
        let hp = this.playerHp;

        hp -= value;

        this.scene.registry.set("playerHp", hp);

        // TODO bounce back and flash

        return hp <= 0;
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

    upgradeBase(upgrade: GameEvent["upgrade"]) {
        if (!upgrade?.resource) {
            return;
        }

        if (upgrade.resource === "playerHp") {
            this.baseStatus.maxPlayerHp += upgrade.delta;
        } else if (upgrade.type === "capacity") {
            this.baseStatus.maxStorage[upgrade.resource] += upgrade.delta;
        } else if (upgrade.type === "replenishment") {
            this.baseStatus.dailyReplenish[upgrade.resource] += upgrade.delta;
        }
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
            filters: Math.min(
                haul.filters + res.filters + stat.dailyReplenish.filters,
                stat.maxStorage.filters
            ),
            food: Math.min(
                haul.food + res.food + stat.dailyReplenish.food,
                stat.maxStorage.food
            ),
            fuel: Math.min(
                haul.fuel + res.fuel + stat.dailyReplenish.fuel,
                stat.maxStorage.fuel
            ),
            panels: Math.min(
                haul.panels + res.panels + stat.dailyReplenish.panels,
                stat.maxStorage.panels
            ),
            parts: Math.min(
                haul.parts + res.parts + stat.dailyReplenish.parts,
                stat.maxStorage.parts
            ),
            water: Math.min(
                haul.water + res.water + stat.dailyReplenish.water,
                stat.maxStorage.water
            ),
        });

        // replenish playerHP as well
        this.scene.registry.set("playerHp", this.baseStatus.maxPlayerHp);

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

        if (stats.colonyCount >= COLONY_COUNT) {
            return "colonies";
        }

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

        // finally, reset player position
        this.worldMap.resetPlayerPosition();

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

    expendScanResources() {
        const res = this.resources;
        const cost = this.baseStatus.fuelCostPerScan;

        if (res.fuel - cost < 0) {
            return false;
        }

        this.updateResources({
            ...res,
            fuel: res.fuel - cost,
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
