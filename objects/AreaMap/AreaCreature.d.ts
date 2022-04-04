import { CellBiome } from "../WorldMap/shared";
export declare class AreaCreature extends Phaser.GameObjects.Sprite {
    static readonly DAMAGE_AMOUNT = 1;
    static readonly SPEED = 50;
    static readonly MOVE_DURATION_MS = 5000;
    body: Phaser.Physics.Arcade.Body;
    private lastDirectionChange;
    constructor(scene: Phaser.Scene, x: number, y: number, biome: CellBiome);
    update(time: number): void;
    private setBiomeTexture;
}
