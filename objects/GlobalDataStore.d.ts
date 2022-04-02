import { WorldMap } from "./WorldMap";
interface Resources {
    type1: number;
    type2: number;
}
/** Handy wrapper around our shared data */
export declare class GlobalDataStore {
    private scene;
    constructor(scene: Phaser.Scene);
    get resources(): Resources;
    get worldMap(): WorldMap;
    private getOrCreate;
}
export {};
