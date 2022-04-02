interface Resources {
    type1: number; // TODO
}

/** Handy wrapper around our shared data */
class GlobalDataStore {
    constructor(private scene: Phaser.Scene) {}

    get resources() {
        let ret = this.scene.registry.get("resources") as Resources;

        if (typeof ret === "undefined") {
            ret = {
                type1: 0,
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

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
        this.global = new GlobalDataStore(this);
    }
}
