import { CustomScene } from "./CustomScene";
import { Resources } from "./GlobalDataStore";

export interface GameEvent {
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

export class EventManager {
    constructor(private scene: CustomScene) {}

    spawnDailyEvent(): EventOutcome {
        const event = this.chooseEvent();
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

    private chooseEvent(): GameEvent {
        // TODO there's only a single hardcoded event right now :'(
        return {
            shortDescriptor: "fire in the greenhouse",
            message:
                "Here's all the crud that broke while you were out.\nAlso, there was a fire (lol).",
            resourceDelta: {
                filters: -1,
                parts: -2,
                food: -5,
            },
        };
    }
}
