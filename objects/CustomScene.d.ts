interface Resources {
    type1: number;
    type2: number;
}
/** Handy wrapper around our shared data */
declare class GlobalDataStore {
    private scene;
    constructor(scene: Phaser.Scene);
    get resources(): Resources;
    set resources(value: Resources);
}
/** Custom version of Scene that has helpers on it */
export declare class CustomScene extends Phaser.Scene {
    global: GlobalDataStore;
    get bounds(): {
        width: number;
        height: number;
    };
    constructor(config: string | Phaser.Types.Scenes.SettingsConfig);
}
export {};
