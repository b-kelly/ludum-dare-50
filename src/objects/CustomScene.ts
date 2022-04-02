interface Resources {
    type1: number; // TODO
    type2: number;
}

/** Handy wrapper around our shared data */
class GlobalDataStore {
    constructor(private scene: Phaser.Scene) {}

    get resources() {
        let ret = this.scene.registry.get("resources") as Resources;

        if (typeof ret === "undefined") {
            ret = {
                type1: 0,
                type2: 0,
            };

            this.resources = ret;
        }

        return ret;
    }

    set resources(value: Resources) {
        this.scene.registry.set("resources", value);
    }
}

/** Custom version of Scene that has helpers on it */
export class CustomScene extends Phaser.Scene {
    global: GlobalDataStore;

    get bounds() {
        const { width, height } = this.cameras.main;
        return {
            width,
            height,
        };
    }

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.global = new GlobalDataStore(this);
    }
}
