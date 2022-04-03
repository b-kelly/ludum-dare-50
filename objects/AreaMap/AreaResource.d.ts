import { Resources } from "../GlobalDataStore";
import { CellBiome } from "../WorldMap/shared";
export declare class AreaResource extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    private resourceType;
    get resource(): keyof Resources;
    constructor(scene: Phaser.Scene, x: number, y: number, resource: keyof Resources, biome: CellBiome);
    static getGenericResourceSpriteFrame(resource: keyof Resources): number;
    private static getRandomResourceSpriteFrame;
}
