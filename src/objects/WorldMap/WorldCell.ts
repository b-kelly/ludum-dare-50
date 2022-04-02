import { DEBUG_isDebugBuild } from "../../shared";
import { CustomScene } from "../CustomScene";
import { Cell, CellType } from "./shared";
import { WorldAssets } from "./WorldMap";

const SHOW_DEBUG = true;

const TILES_SHEET_WIDTH = 3;

export class WorldCell extends Phaser.GameObjects.Sprite {
    private overlay: Phaser.GameObjects.Sprite;
    private hasFogOfWar: boolean;
    private currentState: Parameters<WorldCell["setOverlayState"]>[0];
    private prevState: Parameters<WorldCell["setOverlayState"]>[0];

    constructor(
        scene: CustomScene,
        xIndex: number,
        yIndex: number,
        cell: Cell
    ) {
        const pixelSize = 8;
        // Time to do some trig to find the point coords!
        // Actually, no thank you, I'll cheat since they're hardcoded
        // (Sorry Mrs. Smith, I never was good at showing my work)
        const height = 14 * pixelSize;
        const width = 23 * pixelSize;
        const h2 = height / 2;

        const x = width * xIndex - h2 * xIndex;
        let y = height * yIndex;

        if (xIndex % 2) {
            y += h2;
        }

        super(
            scene,
            x,
            y,
            WorldAssets.tiles,
            WorldCell.getRandomSpriteFrame(cell.type)
        );

        this.name = WorldCell.genName(xIndex, yIndex);

        this.setOrigin(0, 0); //.setStrokeStyle(1, 0x000000);
        this.scene.add.existing(this);

        // TODO looks like the overlay needs to be one "pixel" both wider and longer
        // prettier-ignore
        this.overlay = scene.add.sprite(x, y, WorldAssets.tiles, WorldAssets.tilesData.Overlay * TILES_SHEET_WIDTH).setOrigin(0, 0);

        this.setOverlayState(cell.clearedFogOfWar ? null : "fog");
        this.hasFogOfWar = !cell.clearedFogOfWar;

        this.initEventListeners();

        // TODO DEBUG
        if (DEBUG_isDebugBuild() && SHOW_DEBUG) {
            this.scene.add
                .text(
                    x + h2,
                    y + h2,
                    `${xIndex},${yIndex} ${CellType[
                        cell.type
                    ][0].toUpperCase()}`
                )
                .setOrigin(0.5, 0.5);
        }
    }

    setCellState(state: { isVisitable?: boolean; clearFogOfWar?: boolean }) {
        if (state.clearFogOfWar) {
            this.hasFogOfWar = false;
            this.setOverlayState(null);
        }
        if (state.isVisitable) {
            this.setOverlayState("visitable");
        }
    }

    private setOverlayState(state: "fog" | "hover" | "visitable" | null) {
        this.prevState = this.currentState;

        this.overlay.setVisible(!!state);

        if (state === "fog") {
            this.overlay.setTint(0x000000).setAlpha(0.9);
        } else if (state === "hover") {
            this.overlay.setTint(0xffffff).setAlpha(0.5);
        } else if (state === "visitable") {
            this.overlay.setTint(0x0000ff).setAlpha(0.3);
        }

        this.currentState = state;
    }

    private initEventListeners() {
        this.setInteractive();
        this.on("pointerover", () => this.hover(true)).on("pointerout", () =>
            this.hover(false)
        );
    }

    private hover(hasEntered: boolean) {
        if (this.hasFogOfWar) {
            return;
        }

        this.setOverlayState(hasEntered ? "hover" : this.prevState);
    }

    static genName(x: number, y: number) {
        return `worldcell-${x}-${y}`;
    }

    private static getRandomSpriteFrame(type: CellType) {
        const row = WorldAssets.tilesData[type];
        const startIndex = row * TILES_SHEET_WIDTH;
        const rng = Phaser.Math.RND.integerInRange(0, TILES_SHEET_WIDTH);

        return startIndex + rng;
    }
}
