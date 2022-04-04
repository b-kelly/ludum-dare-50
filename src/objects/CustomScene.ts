import { EventManager } from "./EventManager";
import { GlobalDataStore } from "./GlobalDataStore";

/** Custom version of Scene that has helpers on it */
export class CustomScene extends Phaser.Scene {
    global: GlobalDataStore;
    eventManager: EventManager;

    private backgroundMusic: string;

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

    init(data: object) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (data?.backgroundMusic) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.backgroundMusic = data.backgroundMusic as string;
        }
        this.events.on("transitionout", () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
        });
        this.events.on("transitioninit", () => {
            // TODO not fading in?
            //this.cameras.main.fadeOut(0, 0, 0, 0);
            this.cameras.main.fadeIn(500, 0, 0, 0);
        });
    }

    playBgm(
        key: string,
        extra?: Phaser.Types.Sound.SoundConfig | Phaser.Types.Sound.SoundMarker
    ) {
        this.backgroundMusic = key;
        return this.sound.play(key, extra);
    }

    fadeToScene(target: string, data?: object, keepAudioPlaying = false) {
        if (!keepAudioPlaying && this.backgroundMusic) {
            this.sound.stopByKey(this.backgroundMusic);
        }
        this.scene.transition({
            target,
            data: {
                backgroundMusic: this.backgroundMusic,
                ...data,
            },
            duration: 500,
        });
    }
}
