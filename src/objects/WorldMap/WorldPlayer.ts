import { GeneralAssets } from "../../shared";

export class WorldPlayer extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, GeneralAssets.worldPlayer);
        scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}
