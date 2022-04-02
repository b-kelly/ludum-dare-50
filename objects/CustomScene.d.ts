import { GlobalDataStore } from "./GlobalDataStore";
/** Custom version of Scene that has helpers on it */
export declare class CustomScene extends Phaser.Scene {
    global: GlobalDataStore;
    get bounds(): {
        width: number;
        height: number;
    };
    constructor(config: string | Phaser.Types.Scenes.SettingsConfig);
}
