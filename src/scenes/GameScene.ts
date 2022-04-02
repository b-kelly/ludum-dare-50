interface Controls {
    Left: Phaser.Input.Keyboard.Key;
    Right: Phaser.Input.Keyboard.Key;
    Jump: Phaser.Input.Keyboard.Key;
}

export class GameScene extends Phaser.Scene {
    static readonly KEY = "GameScene";

    // the types are a little funny, so force the type of body we're adding
    private player: Phaser.Physics.Arcade.Sprite;
    private controls: Controls;

    constructor() {
        super({ key: GameScene.KEY });
    }

    preload() {
        /* TODO load some assets */
        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 32,
        });
    }

    create() {
        /* TODO initialize all the things */

        // create our player w/ physics
        this.player = this.physics.add.sprite(0, 0, "player");
        // don't allow the player to leave the screen
        this.player.setCollideWorldBounds(true);

        this.controls = {
            Left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            Right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            Jump: this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            ),
        };
    }

    update(/*time: number*/) {
        /* TODO update all the things */

        if (this.controls.Left.isDown) {
            this.player.setVelocityX(100 * -1);
        } else if (this.controls.Right.isDown) {
            this.player.setVelocityX(100);
        } else {
            this.player.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.controls.Jump)) {
            this.player.setVelocityY(160 * -1);
        }
    }
}
