import { CellBiome } from "../WorldMap/shared";
export declare class AreaCreature extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    constructor(scene: Phaser.Scene, x: number, y: number, biome: CellBiome);
    update(): void;
    private setBiomeTexture;
}
