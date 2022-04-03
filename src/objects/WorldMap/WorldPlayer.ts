import { GeneralAssets } from "../../shared";

export class WorldPlayer extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, GeneralAssets.worldPlayer);
        scene.add.existing(this);
    }
}
