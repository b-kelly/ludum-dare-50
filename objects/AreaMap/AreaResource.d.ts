import { Resources } from "../GlobalDataStore";
import { CellBiome } from "../WorldMap/shared";
export declare class AreaResource extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    private resource;
    constructor(scene: Phaser.Scene, x: number, y: number, resource: keyof Resources, biome: CellBiome);
    private static getResourceSpriteFrame;
}
