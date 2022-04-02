import { WorldMap } from "./WorldMap";

const startingValues = {
    resources: {
        fuel: 10,
        food: 10,
    },
} as const;

interface Resources {
    fuel: number;
    food: number;
}

/** Handy wrapper around our shared data */
export class GlobalDataStore {
    constructor(private scene: Phaser.Scene) {}

    get resources(): Resources {
        return this.getOrCreate<Resources>(
            "resources",
            () => startingValues.resources
        );
    }

    get worldMap(): WorldMap {
        return this.getOrCreate("worldMap", () => new WorldMap());
    }

    expendMoveResources() {
        // TODO SPEND RESOURCES
        return true;
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
