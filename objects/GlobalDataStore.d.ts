import { WorldMap } from "./WorldMap/WorldMap";
interface Resources {
    fuel: number;
    food: number;
}
/** Handy wrapper around our shared data */
export declare class GlobalDataStore {
    private scene;
    constructor(scene: Phaser.Scene);
    get resources(): Readonly<Resources>;
    get worldMap(): WorldMap;
    expendMoveResources(amtToExpend: number): boolean;
    private getOrCreate;
}
export {};
