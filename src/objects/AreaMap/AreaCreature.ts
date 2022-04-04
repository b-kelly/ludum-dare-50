import { GeneralAssets, TILE_WIDTH } from "../../shared";
import { CellBiome } from "../WorldMap/shared";

const GENERIC_CONVERSION_RATE = 0.3;

export class AreaCreature extends Phaser.GameObjects.Sprite {
    static readonly DAMAGE_AMOUNT = 1;
    static readonly SPEED = 150;
    static readonly MOVE_DURATION_MS = 3000;
    declare body: Phaser.Physics.Arcade.Body;

    private lastDirectionChange: number;

    constructor(scene: Phaser.Scene, x: number, y: number, biome: CellBiome) {
        super(
            scene,
            x + TILE_WIDTH / 2,
            y + TILE_WIDTH / 2,
            GeneralAssets.areaEnemies
        );

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.setBounce(0, 0);
        this.body.setImmovable(true);
        this.body.setSize(TILE_WIDTH - 4, TILE_WIDTH - 4, true);

        this.body.setCollideWorldBounds(true, 0, 0);

        this.setBiomeTexture(biome);
    }

    update(time: number) {
        // TODO RANDOMIZE?
        // change direction every so often
        const shouldChangeDirection =
            !this.body.blocked.none ||
            !this.lastDirectionChange ||
            time - this.lastDirectionChange >= AreaCreature.MOVE_DURATION_MS;

        if (!shouldChangeDirection) {
            return;
        }

        this.lastDirectionChange = time;

        const xMod = Phaser.Math.RND.integerInRange(-1, 1);
        const yMod = Phaser.Math.RND.integerInRange(-1, 1);
        let speed = AreaCreature.SPEED;

        if (xMod && yMod) {
            speed = speed / 2;
        }

        this.body.setVelocity(speed * xMod, speed * yMod);

        let rotation = this.angle;

        if (!xMod && yMod < 0) {
            rotation = 0;
        } else if (xMod > 0 && yMod < 0) {
            rotation = 45;
        } else if (xMod > 0 && !yMod) {
            rotation = 90;
        } else if (xMod > 0 && yMod > 0) {
            rotation = 135;
        } else if (!xMod && yMod > 0) {
            rotation = 180;
        } else if (xMod < 0 && yMod > 0) {
            rotation = 225;
        } else if (xMod < 0 && !yMod) {
            rotation = 270;
        } else if (xMod < 0 && yMod < 0) {
            rotation = 315;
        }

        this.setAngle(rotation);
    }

    private setBiomeTexture(biome: CellBiome) {
        const sheetWidth = 4;
        let row = 0;
        switch (biome) {
            case "desert":
                row = 1;
                break;
            case "wetland":
                row = 0;
                break;
            case "forest":
            default:
                row = 2;
                break;
        }

        let animation = `areacreature_${biome}`;

        // GENERIC_CONVERSION_RATE chance the creature uses the generic sprite
        if (Phaser.Math.RND.frac() <= GENERIC_CONVERSION_RATE) {
            row = 3;
            animation = "areacreature_generic";
        }

        this.setFrame(row * sheetWidth);
        this.play(
            {
                key: animation,
                repeat: -1,
            },
            true
        );
    }
}
