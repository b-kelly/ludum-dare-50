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
    init(data: object) {
        this.events.on("transitionout", () => {
            // TODO DOESN'T WORK YET
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //// @ts-expect-error
            //if (!data?.keepAudioPlaying) {
            // TODO fade bg tracks?
            this.sound.stopAll();
            //}
            this.cameras.main.fadeOut(500, 0, 0, 0);
        });
        this.events.on("transitionstart", () => {
            // TODO not fading in?
            //this.cameras.main.fadeOut(0, 0, 0, 0);
            this.cameras.main.fadeIn(500, 0, 0, 0);
        });
    }

    fadeToScene(target: string, data?: object, keepAudioPlaying = false) {
        this.scene.transition({
            target,
            data: {
                keepAudioPlaying,
                ...data,
            },
            duration: 500,
        });
    }
}
