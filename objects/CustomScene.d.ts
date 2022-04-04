import { EventManager } from "./EventManager";
import { GlobalDataStore } from "./GlobalDataStore";
/** Custom version of Scene that has helpers on it */
export declare class CustomScene extends Phaser.Scene {
    global: GlobalDataStore;
    eventManager: EventManager;
    get bounds(): {
        width: number;
        height: number;
    };
    constructor(config: string | Phaser.Types.Scenes.SettingsConfig);
    init(data: object): void;
    fadeToScene(target: string, data?: object, keepAudioPlaying?: boolean): void;
}
