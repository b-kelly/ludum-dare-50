import { GeneralAssets } from "../shared";
import { CustomScene } from "./CustomScene";
import { BaseStatus, CampaignStats, Resources } from "./GlobalDataStore";
import { CellBiome } from "./WorldMap/shared";

/**
 * none - can happen any time
 * daily - only happens on daily review
 * map - only happens as a random map event
 */
type EventType = "none" | "daily" | "map" | "colony";

type EventCharacter =
    | "none"
    | "kiran"
    | "adzo"
    | "shreya"
    | "kamal"
    | "lufti"
    | "rupert"
    | "harish"
    | "annika"
    | "gaston"
    | "martin"
    | "britt"
    | "girish"
    | "sachin"
    | "chip"
    | "dora"
    | "marcel";

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
    upgrades?: unknown; // TODO
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
    resourcesPrior: Resources;
    /** event caused a game over */
    gameOver: boolean;
    /** two part event was a success? */
    eventPassed?: boolean;
}

export class EventManager {
    constructor(private scene: CustomScene) {}

    chooseAndSetDailyEvent() {
        const event = this.chooseEvent("daily");
        this.scene.global.setDailyEvent(event);
        return event;
    }

    completeDailyEvent(): EventOutcome {
        const dailyEvent = this.scene.global.currentDay.dailyEvent;
        const resources = this.scene.global.resources;
        this.applyEvent(dailyEvent);

        return {
            message: dailyEvent?.message,
            resourceDelta: dailyEvent?.resourceDelta,
            resourcesPrior: resources,
            gameOver: false,
        };
    }

    spawnDailyEvent(): EventOutcome {
        return this.spawnEvent("daily");
    }

    spawnMapEvent(): EventOutcome {
        return this.spawnEvent("map");
    }

    spawnColonyEvent() {
        return this.spawnEvent("colony");
    }

    private spawnEvent(type: EventType): EventOutcome {
        const event = this.chooseEvent(type);

        if (!event) {
            return; // you got lucky this time...
        }

        const resources = this.scene.global.resources;
        this.applyEvent(event);

        return {
            message: event.message,
            resourceDelta: event.resourceDelta,
            resourcesPrior: resources,
            gameOver: false,
        };
    }

    private applyEvent(event: GameEvent) {
        this.scene.global.logEvent(event);
        // go ahead and let resources drop below zero here - we only game over when a day ends
        this.scene.global.adjustHaul(event?.resourceDelta);

        // apply upgrades and bonuses from colonies
        if (event?.type === "colony") {
            // TODO apply upgrades
        }
    }

    private chooseEvent(type: EventType): GameEvent {
        // TODO I want to get real crazy choosing events here
        // For instance, low on air filters? Mold starts growing in the vents.
        // Have too much food? Vermin.
        // For now, just check against the type

        // Prority 1 (colony only) - Colony discovery
        // Priority 2 (daily only) - On specific day event
        // Priority 3a (daily only) - Resource events
        // Priority 3b (daily/map only) - General random events

        const events = this.events();

        const stats = this.scene.global.campaignStats;

        // colony disovery
        if (type === "colony") {
            const colonyCount = stats.colonyCount;
            const event = events.colony.find(
                (e) => e.conditions?.coloniesFound === colonyCount
            );

            if (!event) {
                throw `Unable to find event for colonyCount ${colonyCount}`;
            }

            return event;
        }

        if (type === "daily") {
            const currentDay = stats.dayCount;
            let event = events.onDay.find(
                (e) => e.conditions?.onDay === currentDay
            );

            // don't fret if there's no event specific to this day
            if (event) {
                return event;
            }

            // check for random resource event
            const currentStash = this.scene.global.resources;
            const baseStatus = this.scene.global.baseStatus;
            event = events.resource.find((e) =>
                this.checkResourceCondition(e, currentStash, baseStatus)
            );

            // no event? no worries - random will come through for us
            if (event) {
                return event;
            }

            const tilesVisited =
                this.scene.global.worldMap.getPlayerCellStats().visited;
            const biome = this.scene.global.worldMap.getPlayerCell().biome;

            // general random daily event
            // TODO SUPPORT UNIQUE
            // TODO CHECK CONDITIONS
            event = Phaser.Math.RND.pick(
                events.random.filter((e) =>
                    this.checkMiscConditions(
                        e,
                        "daily",
                        currentStash,
                        baseStatus,
                        stats,
                        biome,
                        tilesVisited
                    )
                )
            );

            // yeah, this shouldn't happen if the json is filled
            if (!event) {
                throw "Unable to find appropriate daily event";
            }

            return event;
        }

        if (type === "map") {
            const currentStash = this.scene.global.resources;
            const baseStatus = this.scene.global.baseStatus;
            const tilesVisited =
                this.scene.global.worldMap.getPlayerCellStats().visited;
            const biome = this.scene.global.worldMap.getPlayerCell().biome;
            // TODO SUPPORT UNIQUE
            // TODO CHECK CONDITIONS
            const event = Phaser.Math.RND.pick(
                events.random.filter((e) =>
                    this.checkMiscConditions(
                        e,
                        "map",
                        currentStash,
                        baseStatus,
                        stats,
                        biome,
                        tilesVisited
                    )
                )
            );

            // yeah, this shouldn't happen if the json is filled
            if (!event) {
                throw "Unable to find appropriate daily event";
            }

            return event;
        }
    }

    private checkResourceCondition(
        event: GameEvent,
        currentResources: Resources,
        baseStats: BaseStatus
    ) {
        if (!event?.conditions?.resource?.type) {
            return false;
        }

        // trigger if the resource is:
        // if "few" < max / 2
        // if "many" > max * 0.75

        const currentCount = currentResources[event.conditions.resource.type];
        const maxStorage = baseStats.maxStorage[event.conditions.resource.type];
        if (
            event.conditions.resource.trigger === "many" &&
            currentCount >= maxStorage * 0.75
        ) {
            return true;
        } else if (
            event.conditions.resource.trigger === "few" &&
            currentCount <= maxStorage / 2
        ) {
            return true;
        }

        return false;
    }

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

    private checkMiscConditions(
        event: GameEvent,
        type: EventType,
        currentResources: Resources,
        baseStatus: BaseStatus,
        stats: CampaignStats,
        biome: CellBiome,
        tilesVisited: number
    ) {
        if (event.type !== type && event.type !== "none") {
            return false;
        }

        if (!event.conditions) {
            return true;
        }

        let satisfies = true;
        if ("coloniesFound" in event.conditions) {
            satisfies &&= event.conditions.coloniesFound <= stats.colonyCount;
        }

        if ("biome" in event.conditions) {
            satisfies &&= event.conditions.biome === biome;
        }

        if ("resource" in event.conditions) {
            satisfies &&= this.checkResourceCondition(
                event,
                currentResources,
                baseStatus
            );
        }

        if ("tilesVisited" in event.conditions) {
            satisfies &&= event.conditions.tilesVisited <= tilesVisited;
        }

        return satisfies;
    }

    private events() {
        const json = this.scene.cache.json.get(
            GeneralAssets.events
        ) as JsonSchema;

        if (!json) {
            throw "events.json not loaded";
        }

        return json;
    }
}
