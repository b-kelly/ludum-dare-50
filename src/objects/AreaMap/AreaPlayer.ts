import { TILE_WIDTH } from "../../shared";

interface Controls {
    Up: Phaser.Input.Keyboard.Key;
    Right: Phaser.Input.Keyboard.Key;
    Down: Phaser.Input.Keyboard.Key;
    Left: Phaser.Input.Keyboard.Key;
}

export class AreaPlayer extends Phaser.GameObjects.Rectangle {
    declare body: Phaser.Physics.Arcade.Body;
    private controls: Controls;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, TILE_WIDTH, TILE_WIDTH, 0xff0000);

        this.setOrigin(0, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.cameras.main.startFollow(this);

        this.body.setBounce(0, 0);
        this.body.setSize(TILE_WIDTH - 4, TILE_WIDTH - 4, true);

        this.controls = {
            Up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            Right: scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.D
            ),
            Down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            Left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        };
    }

    update() {
        const playerSpeed = 200;
        let yVelocity = 0;
        let xVelocity = 0;

        if (this.controls.Up.isDown) {
            yVelocity = -playerSpeed;
        } else if (this.controls.Down.isDown) {
            yVelocity = playerSpeed;
        }

        if (this.controls.Left.isDown) {
            xVelocity = -playerSpeed;
        } else if (this.controls.Right.isDown) {
            xVelocity = playerSpeed;
        }

        this.body.setVelocity(xVelocity, yVelocity);
    }
}
