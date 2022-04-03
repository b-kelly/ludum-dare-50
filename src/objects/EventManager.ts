import { CustomScene } from "./CustomScene";
import { Resources } from "./GlobalDataStore";

/**
 * none - can happen any time
 * daily - only happens on daily review
 * map - only happens as a random map event
 */
type EventType = "none" | "daily" | "map";

export interface GameEvent {
    type: EventType;
    shortDescriptor: string;
    message: string;
    resourceDelta: Partial<Resources>;
    // TODO more stuff that helps to choose an event based on current progress
}

export interface EventOutcome {
    message: string;
    resourceDelta: Partial<Resources>;
    resourcesPrior: Resources;
}

// TODO MOVE TO JSON FILE
const EVENTS: GameEvent[] = [
    {
        type: "daily",
        shortDescriptor: "fire in the greenhouse",
        message:
            "Here's all the crud that broke while you were out.\nAlso, there was a fire (lol).",
        resourceDelta: {
            filters: -1,
            parts: -2,
            food: -5,
        },
    },
    {
        type: "map",
        shortDescriptor: "heat wave",
        message:
            "It was awfully hot today. You couldn't handle it (weakling)\nand drank way more of your water reserves than you should have.",
        resourceDelta: {
            water: -3,
        },
    },
    {
        type: "none",
        shortDescriptor: "flat tire",
        message:
            "You hit a bad pothole (loser) and had to spend precious time and parts to fix a flat tire.",
        resourceDelta: {
            fuel: -1,
            filters: -1,
            parts: -2,
        },
    },
];

export class EventManager {
    constructor(private scene: CustomScene) {}

    spawnDailyEvent(): EventOutcome {
        return this.spawnEvent("daily");
    }

    spawnMapEvent(): EventOutcome {
        return this.spawnEvent("map");
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
        };
    }

    private applyEvent(event: GameEvent) {
        this.scene.global.logEvent(event);
        this.scene.global.adjustHaul(event.resourceDelta);
    }

    private chooseEvent(type: EventType): GameEvent {
        // TODO I want to get real crazy choosing events here
        // For instance, low on air filters? Mold starts growing in the vents.
        // Have too much food? Vermin.
        // For now, just check against the type

        return Phaser.Math.RND.pick(
            EVENTS.filter((e) => e.type === type || e.type === "none")
        );
    }
}
