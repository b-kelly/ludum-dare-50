import { CustomScene } from "../objects/CustomScene";
import { Cell } from "../objects/WorldMap/shared";
import { WorldCell } from "../objects/WorldMap/WorldCell";
import { WorldAssets } from "../objects/WorldMap/WorldMap";
import { WorldPlayer } from "../objects/WorldMap/WorldPlayer";
import { GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { DayReviewScene } from "./DayReviewScene";
import { ExploreAreaScene } from "./ExploreAreaScene";
import { StatusUiScene, STATUS_UI_HEIGHT } from "./StatusUiScene";

export class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";
    private player: WorldPlayer;
    private movingTowardsCoords: { x: number; y: number };
    private exploreButton: Button;

    constructor() {
        super({ key: OverworldScene.KEY });
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
        this.movePlayerAndUpdateCells(null, null);

        const playerCell = this.global.worldMap.getPlayerCell();

        this.exploreButton = new Button(this, {
            x: 0,
            y: STATUS_UI_HEIGHT,
            text: "Explore",
            onClick: () => this.exploreCell(),
            disabled: this.canExploreCell(playerCell),
        }).setScrollFactor(0, 0);

        new Button(this, {
            x: 0,
            y: STATUS_UI_HEIGHT + 100,
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
        const playerCell = this.global.worldMap.getPlayerCell();
        this.global.worldMap.markCellExplored(playerCell.x, playerCell.y);
        this.global.logTileExploration();
        this.scene.start(ExploreAreaScene.KEY, {
            ...playerCell,
        });
    }

    private returnToCamp() {
        this.scene.start(DayReviewScene.KEY, {
            dailyHaul: this.global.currentDay.haul,
        });
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

        this.movePlayerAndUpdateCells(x, y);
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

    private movePlayerAndUpdateCells(
        newPX: number | null,
        newPY: number | null
    ) {
        // don't try to move during init
        if (newPX !== null && newPY !== null) {
            const cellWasVisited = this.global.worldMap.getCell(
                newPX,
                newPY
            ).playerHasVisited;

            this.updatePlayerAdjacentCells(true);
            this.movePlayerToCoord(newPX, newPY);
            const playerCell = this.global.worldMap.getPlayerCell();

            if (!cellWasVisited) {
                // fire off events
                if (playerCell.type === "event") {
                    const event = this.eventManager.spawnMapEvent();
                    // TODO show on UI
                    console.log(event);
                } else if (playerCell.type === "colony") {
                    const event = this.eventManager.spawnColonyEvent();
                    // TODO show on UI
                    console.log(event);
                }

                this.global.logTileVisit(playerCell.type);
            }

            // update UI
            this.exploreButton?.setDisabled(!this.canExploreCell(playerCell));
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
        const adjCells = this.global.worldMap.getPlayerAdjacentCellCoords();

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

    private canExploreCell(cell: Cell) {
        return !cell.playerHasExplored && cell.type === "explorable";
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
