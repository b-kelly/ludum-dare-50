import { CustomScene } from "../objects/CustomScene";
import { WorldCell } from "../objects/WorldMap/WorldCell";
import { WorldAssets } from "../objects/WorldMap/WorldMap";
import { WorldPlayer } from "../objects/WorldMap/WorldPlayer";
import { GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { DayReviewScene } from "./DayReviewScene";
import { ExploreAreaScene } from "./ExploreAreaScene";
import { StatusUiScene } from "./StatusUiScene";

export class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";
    private player: WorldPlayer;
    private movingTowardsCoords: { x: number; y: number };

    constructor() {
        super({ key: OverworldScene.KEY });
    }

    init() {
        // TODO
    }

    preload() {
        this.load.spritesheet(WorldAssets.tiles, "assets/hex-sprites.png", {
            frameWidth: 23 * 8,
            frameHeight: 14 * 8,
        });

        this.load.spritesheet(
            GeneralAssets.worldPlayer,
            "assets/overworld-car.png",
            {
                frameWidth: 96,
                frameHeight: 96,
            }
        );
    }

    create() {
        this.createAnimations();
        this.drawHexMap();
        this.updateMap(null, null);

        new Button(this, {
            x: 0,
            y: 50,
            text: "Explore",
            onClick: () => this.exploreCell(),
        }).setScrollFactor(0, 0);

        new Button(this, {
            x: 0,
            y: 100,
            text: "End day",
            onClick: () => this.returnToCamp(),
        }).setScrollFactor(0, 0);

        this.global.worldMap.DEBUG_displayMap();

        if (!this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.launch(StatusUiScene.KEY);
        }
    }

    update() {
        // because of how timing works, the player may not reach the exact point, so check within a threshold
        if (
            this.movingTowardsCoords &&
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.movingTowardsCoords.x,
                this.movingTowardsCoords.y
            ) < 2
        ) {
            this.player.body.setVelocity(0);
            this.player.setPosition(
                this.movingTowardsCoords.x,
                this.movingTowardsCoords.y
            );
            this.movingTowardsCoords = null;
        }
    }

    private exploreCell() {
        this.scene.start(ExploreAreaScene.KEY, {
            ...this.global.worldMap.getPlayerCell(),
        });
    }

    private returnToCamp() {
        this.scene.start(DayReviewScene.KEY, {
            dailyHaul: this.global.currentDay,
        });
    }

    private drawHexMap() {
        const map = this.global.worldMap;
        const playerCoords = map.playerCoords;
        let playerCell: WorldCell;

        map.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                const wc = new WorldCell(this, x, y, cell);

                if (x === playerCoords.x && y === playerCoords.y) {
                    wc.setCellState({ clearFogOfWar: true });
                    playerCell = wc;
                }
            });
        });

        const { x, y } = playerCell.getCenter();
        this.player = new WorldPlayer(this, x, y);
        this.cameras.main.startFollow(this.player);
    }

    private updateMap(newPX: number | null, newPY: number | null) {
        // don't try to move during init
        if (newPX !== null && newPY !== null) {
            this.updatePlayerAdjacentCells(true);
            this.movePlayerToCoord(newPX, newPY);
        }
        // TODO clear fog of war in wider area?

        this.updatePlayerAdjacentCells(false);
    }

    private movePlayerToCoord(x: number, y: number) {
        const map = this.global.worldMap;
        map.setPlayerPosition(x, y);
        const { x: px, y: py } = this.getCell(x, y).getCenter();

        this.physics.moveTo(this.player, px, py, 0, 350);
        this.movingTowardsCoords = { x: px, y: py };
    }

    private updatePlayerAdjacentCells(disable: boolean) {
        const adjCells = this.global.worldMap.getPlayerAdjacentCells();

        adjCells.forEach((c) => {
            const wc = this.getCell(c.x, c.y);

            if (!wc) {
                // TODO ERROR
                return true;
            }

            if (disable) {
                wc.off("pointerup");
            } else {
                wc.on("pointerup", () => this.selectSquare(c.x, c.y));
            }

            wc.setCellState({ isVisitable: !disable, clearFogOfWar: true });
        });
    }

    private getCell(x: number, y: number) {
        return this.children.getByName(WorldCell.genName(x, y)) as WorldCell;
    }

    private selectSquare(x: number, y: number) {
        if (this.movingTowardsCoords) {
            return false;
        }

        // TODO don't hardcode
        const cost = this.global.worldMap.cells[y][x].playerHasVisited ? 1 : 2;

        // TODO if there are not enough resources to move
        if (!this.global.expendMoveResources(cost)) {
            console.log("TODO CANNOT MOVE");
            return false;
        }

        this.updateMap(x, y);
    }

    private createAnimations() {
        this.anims.create({
            key: "cursor_blink",
            frameRate: 2,
            frames: this.anims.generateFrameNumbers(WorldAssets.tiles, {
                start: 16,
                end: 17,
            }),
            repeat: -1,
        });
    }
}
