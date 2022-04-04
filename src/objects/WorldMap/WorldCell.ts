import { DEBUG_isDebugBuild } from "../../shared";
import { CustomScene } from "../CustomScene";
import { Cell, TILES_SHEET_WIDTH } from "./shared";
import { WorldAssets } from "./WorldMap";

const SHOW_DEBUG = false;

export class WorldCell extends Phaser.GameObjects.Sprite {
    private overlay: Phaser.GameObjects.Sprite;
    private hasFogOfWar: boolean;
    private isVisitable: boolean;

    private coords: { x: number; y: number };

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

        super(scene, x, y, WorldAssets.tiles, cell.randomSpriteFrame);

        // set the name so we can easily find a specific object later
        this.name = WorldCell.genName(xIndex, yIndex);
        this.coords = {
            x: xIndex,
            y: yIndex,
        };

        this.setOrigin(0, 0);
        this.scene.add.existing(this);

        this.overlay = scene.add
            .sprite(
                x,
                y,
                WorldAssets.tiles,
                WorldAssets.tilesData.Overlay * TILES_SHEET_WIDTH
            )
            .setOrigin(0, 0);

        this.hasFogOfWar = !cell.clearedFogOfWar;
        this.setOverlayState(cell.clearedFogOfWar ? null : "fog");

        this.initEventListeners();

        if (DEBUG_isDebugBuild() && SHOW_DEBUG) {
            const typeStr = cell.type.slice(0, 3).toUpperCase();
            const biomeStr = cell.biome.slice(0, 3).toUpperCase();
            this.scene.add.text(
                x,
                y + h2,
                `x${xIndex}y${yIndex},b${biomeStr},t${typeStr}`
            );
        }
    }

    setCellState(state: { isVisitable?: boolean; clearFogOfWar?: boolean }) {
        if (state.clearFogOfWar) {
            this.hasFogOfWar = false;
            this.setOverlayState(null);
        }

        if ("isVisitable" in state) {
            this.isVisitable = state.isVisitable;
        }
    }

    private setOverlayState(state: "fog" | "hover" | null) {
        this.overlay.setVisible(!!state);

        if (state === "fog") {
            this.overlay.stop();
            this.overlay.setTint(0x000000).setAlpha(0.9);
        } else if (state === "hover") {
            this.overlay.play("cursor_blink", true);
            this.overlay.setTint(0xffffff).setAlpha(0.75);
            if (this.isVisitable) {
                this.overlay.setTint(0x0000ff).setAlpha(0.75);
            }
        } else {
            this.overlay.stop();
        }
    }

    private initEventListeners() {
        this.setInteractive();
        this.on("pointerover", () => this.hover(true)).on("pointerout", () =>
            this.hover(false)
        );
    }

    private hover(hasEntered: boolean) {
        this.scene.events.emit("worldcell_hover", {
            hasEntered,
            coords: this.coords,
        });

        if (this.hasFogOfWar) {
            return;
        }

        this.setOverlayState(hasEntered ? "hover" : null);
    }

    static genName(x: number, y: number) {
        return `worldcell-x${x}-y${y}`;
    }
}
