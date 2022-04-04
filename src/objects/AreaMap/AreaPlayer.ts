import { GeneralAssets, TILE_WIDTH } from "../../shared";

// number of MS the player is invulnerable after being damaged
const INVULN_LENGTH_MS = 1000;

interface Controls {
    Up: Phaser.Input.Keyboard.Key;
    Right: Phaser.Input.Keyboard.Key;
    Down: Phaser.Input.Keyboard.Key;
    Left: Phaser.Input.Keyboard.Key;
}

export class AreaPlayer extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body;
    private controls: Controls;

    private damagedAt: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(
            scene,
            x + TILE_WIDTH / 2,
            y + TILE_WIDTH / 2,
            GeneralAssets.areaPlayer,
            0
        );

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.cameras.main.startFollow(this);
        scene.cameras.main.roundPixels = true;

        this.body.setBounce(0, 0);
        this.body.setSize(TILE_WIDTH - 4, TILE_WIDTH - 4, true);

        this.body.setCollideWorldBounds(true, 0, 0);

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
        if (!this.active) {
            return;
        }

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

        if (xVelocity && yVelocity) {
            xVelocity *= 0.75;
            yVelocity *= 0.75;
        }

        this.body.setVelocity(xVelocity, yVelocity);

        if (xVelocity !== 0 || yVelocity !== 0) {
            this.play("player_walk", true);
        } else {
            this.stop();
            this.setFrame(0);
        }

        let rotation = this.angle;

        if (!xVelocity && yVelocity < 0) {
            rotation = 0;
        } else if (xVelocity > 0 && yVelocity < 0) {
            rotation = 45;
        } else if (xVelocity > 0 && !yVelocity) {
            rotation = 90;
        } else if (xVelocity > 0 && yVelocity > 0) {
            rotation = 135;
        } else if (!xVelocity && yVelocity > 0) {
            rotation = 180;
        } else if (xVelocity < 0 && yVelocity > 0) {
            rotation = 225;
        } else if (xVelocity < 0 && !yVelocity) {
            rotation = 270;
        } else if (xVelocity < 0 && yVelocity < 0) {
            rotation = 315;
        }

        this.setAngle(rotation);
    }

    damage(time: number) {
        if (this.damagedAt > 0 && time - this.damagedAt < INVULN_LENGTH_MS) {
            return false;
        }

        this.damagedAt = time;

        return true;
    }
}
