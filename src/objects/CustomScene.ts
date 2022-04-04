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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init(_: unknown) {
        console.log("init transition" + this.scene.key);
        this.events.on("transitionout", () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
        });
        this.events.on("transitionstart", () => {
            // TODO not fading in?
            //this.cameras.main.fadeOut(0, 0, 0, 0);
            this.cameras.main.fadeIn(500, 0, 0, 0);
        });
    }

    fadeToScene(target: string, data?: object) {
        this.scene.transition({
            target,
            data,
            duration: 500,
        });
    }
}
