import { EventManager } from "./EventManager";
import { GlobalDataStore } from "./GlobalDataStore";

/** Custom version of Scene that has helpers on it */
export class CustomScene extends Phaser.Scene {
    global: GlobalDataStore;
    eventManager: EventManager;

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
        this.eventManager = new EventManager(this);
    }
}
