import { WorldMap } from "./WorldMap";

interface Resources {
    type1: number; // TODO
    type2: number;
}

/** Handy wrapper around our shared data */
export class GlobalDataStore {
    constructor(private scene: Phaser.Scene) {}

    get resources(): Resources {
        return this.getOrCreate<Resources>("resources", () => ({
            type1: 0,
            type2: 0,
        }));
    }

    get worldMap(): WorldMap {
        return this.getOrCreate("worldMap", () => new WorldMap());
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
