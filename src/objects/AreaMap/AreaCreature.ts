import { GeneralAssets, TILE_WIDTH } from "../../shared";
import { CellBiome } from "../WorldMap/shared";

const GENERIC_CONVERSION_RATE = 0.3;

export class AreaCreature extends Phaser.GameObjects.Sprite {
    static readonly DAMAGE_AMOUNT = 1;
    declare body: Phaser.Physics.Arcade.Body;

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

    update() {
        // TODO
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
