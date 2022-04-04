import { CellBiome } from "../WorldMap/shared";
export declare class AreaCreature extends Phaser.GameObjects.Sprite {
    static readonly DAMAGE_AMOUNT = 1;
    body: Phaser.Physics.Arcade.Body;
    constructor(scene: Phaser.Scene, x: number, y: number, biome: CellBiome);
    update(): void;
    private setBiomeTexture;
}
