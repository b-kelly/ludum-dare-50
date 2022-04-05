import { CustomScene } from "../objects/CustomScene";
import { EventOutcome } from "../objects/EventManager";
import { Cell } from "../objects/WorldMap/shared";
import { WorldCell } from "../objects/WorldMap/WorldCell";
import { WorldAssets } from "../objects/WorldMap/WorldMap";
import { WorldPlayer } from "../objects/WorldMap/WorldPlayer";
import { baseTextOptions, GeneralAssets, SfxAssets, UiAssets } from "../shared";
import { Button } from "../UI/Button";
import { TextBox } from "../UI/TextBox";
import { DayReviewScene } from "./DayReviewScene";
import { ExploreAreaScene } from "./ExploreAreaScene";
import { StatusUiScene, STATUS_UI_HEIGHT } from "./StatusUiScene";

export class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";
    private player: WorldPlayer;
    private movingTowardsCoords: { x: number; y: number };
    private exploreButton: Button;
    private textBox: TextBox;
    private noticeBox: TextBox;
    private tooltip: Phaser.GameObjects.Text;

    constructor() {
        super({ key: OverworldScene.KEY });
    }

    preload() {
        this.load.spritesheet(
            WorldAssets.tiles,
            "assets/sprites/biome-hex-tileset.png",
            {
                frameWidth: 23 * 8,
                frameHeight: 14 * 8,
            }
        );

        this.load.spritesheet(
            GeneralAssets.worldPlayer,
            "assets/sprites/overworld-car.png",
            {
                frameWidth: 96,
                frameHeight: 96,
            }
        );

        this.load.audio(
            SfxAssets.bgIntroOverworld.key,
            "assets/sfx/bg-intro-overworld.mp3"
        );

        this.load.audio(SfxAssets.engine, "assets/sfx/engine.wav");
        this.load.audio(SfxAssets.mapEvent, "assets/sfx/map-event.mp3");
        this.load.audio(SfxAssets.mapScan, "assets/sfx/map-scan.mp3");
    }

    create() {
        this.playBgm(
            SfxAssets.bgIntroOverworld.key,
            SfxAssets.bgIntroOverworld.marker
        );

        this.createAnimations();
        this.drawHexMap();
        this.movePlayerAndUpdateCells(null, null);
        const playerCell = this.global.worldMap.getPlayerCell();

        const padding = 8;

        this.exploreButton = new Button(this, {
            x: this.bounds.width - padding,
            y: STATUS_UI_HEIGHT + padding,
            text: "Explore",
            onClick: () => this.exploreCell(),
            disabled: !this.canExploreCell(playerCell),
        })
            .setScrollFactor(0, 0, true)
            .setOrigin(1, 0);

        new Button(this, {
            x: this.bounds.width - padding,
            y: this.bounds.height - padding,
            text: "End day",
            onClick: () => this.returnToCamp(),
        })
            .setScrollFactor(0, 0, true)
            .setOrigin(1, 1);

        new Button(this, {
            x: this.bounds.width - padding,
            y: this.exploreButton.y + this.exploreButton.height + padding,
            text: "Scan",
            onClick: () => {
                if (!this.global.expendScanResources()) {
                    this.showNotice(["CANNOT SCAN"]);
                } else {
                    this.scanSurroundings();
                }
            },
        })
            .setScrollFactor(0, 0, true)
            .setOrigin(1, 0);

        this.global.worldMap.DEBUG_displayMap();

        if (!this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.launch(StatusUiScene.KEY);
        }

        this.textBox = new TextBox(this, {
            x: padding,
            y: STATUS_UI_HEIGHT,
            backgroundAsset: this.add.image(0, 0, UiAssets.tutorialPane),
            pages: [],
            padding: 64,
            buttonText: "Got it",
            buttonAlign: "center",
            pageStyles: {
                fontSize: "14pt",
            },
        })
            .setScrollFactor(0, 0, true)
            .setVisible(false);

        this.noticeBox = new TextBox(this, {
            x: padding,
            y: STATUS_UI_HEIGHT,
            backgroundAsset: this.add.rectangle(
                0,
                0,
                this.bounds.width / 3,
                this.bounds.height / 2,
                0x0a2a33
            ),
            pages: [],
            padding: 8,
            buttonText: "Close",
            buttonAlign: "center",
        })
            .setScrollFactor(0, 0, true)
            .setVisible(false)
            .on("proceedclick", () => {
                this.noticeBox.setVisible(false);
            });

        this.tooltip = this.add
            .text(0, 0, "", {
                ...baseTextOptions,
                backgroundColor: "#000000",
                padding: {
                    x: 8,
                    y: 8,
                },
            })
            .setOrigin(1, 1);

        this.events.on(
            "worldcell_hover",
            (data: {
                hasEntered: boolean;
                coords: { x: number; y: number };
            }) => {
                this.tooltip.setVisible(data.hasEntered);
                const cell = this.global.worldMap.getCell(
                    data.coords.x,
                    data.coords.y
                );

                if (!cell.clearedFogOfWar) {
                    this.tooltip.text = `???\nUndiscovered`;
                    return;
                }

                const biomeName = cell.biome.replace(/^./, (c) =>
                    c.toUpperCase()
                );
                const status = cell.playerHasExplored
                    ? "Explored"
                    : cell.playerHasVisited
                        ? "Visited"
                        : "Unvisited";
                const explored =
                    cell.playerHasVisited && cell.type === "explorable"
                        ? cell.playerHasExplored
                            ? " (Explored)"
                            : " (Unexplored)"
                        : "";
                this.tooltip.text = `${biomeName}\n${status}${explored}`;
            }
        );

        this.launchTutorial();
    }

    update() {
        this.updateTooltip();

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

    private updateTooltip() {
        const { worldX, worldY } = this.input.activePointer;
        this.tooltip.setPosition(worldX, worldY);
    }

    private launchTutorial() {
        const tutorialComplete = this.getTutorialCompleted();
        if (tutorialComplete || this.global.campaignStats.dayCount !== 0) {
            return false;
        }

        const currentDay = this.global.currentDay;
        const tutorialStep = this.getTutorialStep();

        if (currentDay.tilesExplored > 0) {
            // tutorial 3
            this.textBox
                .setPages([
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    this.cache.json.get(GeneralAssets.narration)
                        .tutorial3 as string[],
                ])
                .off("proceedclick")
                .on("proceedclick", () => {
                    this.completeTutorialStep(3);
                    this.textBox.setVisible(false);
                })
                .setVisible(true);
            return true;
        } else if (currentDay.tilesVisited === 0 && tutorialStep > 0) {
            // tutorial 2
            this.textBox
                .setPages([
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    this.cache.json.get(GeneralAssets.narration)
                        .tutorial2 as string[],
                ])
                .off("proceedclick")
                .on("proceedclick", () => {
                    this.completeTutorialStep(2);
                    this.textBox.setVisible(false);
                })
                .setVisible(true);
            return true;
        } else if (tutorialStep === 0) {
            // tutorial 1
            this.textBox
                .setPages([
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    this.cache.json.get(GeneralAssets.narration)
                        .tutorial1 as string[],
                ])
                .off("proceedclick")
                .on("proceedclick", () => {
                    this.textBox.setVisible(false);
                    this.completeTutorialStep(1);
                })
                .setVisible(true);
            return true;
        }

        return false;
    }

    private exploreCell() {
        const playerCell = this.global.worldMap.getPlayerCell();
        this.global.worldMap.markCellExplored(playerCell.x, playerCell.y);
        this.global.logTileExploration();
        this.fadeToScene(ExploreAreaScene.KEY, {
            ...playerCell,
        });
    }

    private returnToCamp() {
        this.fadeToScene(DayReviewScene.KEY, {
            dailyHaul: this.global.currentDay.haul,
        });
    }

    private selectSquare(x: number, y: number) {
        this.sound.play(SfxAssets.click.key, SfxAssets.click.config);

        if (this.movingTowardsCoords) {
            return false;
        }

        let fuelCost = this.global.baseStatus.fuelCostUnvisitedTile;
        if (this.global.worldMap.cells[y][x].playerHasVisited) {
            fuelCost = this.global.baseStatus.fuelCostVisitedTile;
        }

        // if there are not enough resources to move
        if (!this.global.expendMoveResources(fuelCost)) {
            this.showNotice(["CANNOT MOVE"]);
            return false;
        }

        const next = () => this.movePlayerAndUpdateCells(x, y);

        if (!this.getTutorialCompleted() && this.launchTutorial()) {
            this.textBox.on("proceedclick", () => next());
        } else {
            next();
        }
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

            this.sound.stopByKey(SfxAssets.engine);
            this.sound.play(SfxAssets.engine, {
                volume: 0.2,
            });
            this.updatePlayerAdjacentCells(true);
            this.movePlayerToCoord(newPX, newPY);
            const playerCell = this.global.worldMap.getPlayerCell();

            if (!cellWasVisited) {
                // fire off events
                if (playerCell.type === "event") {
                    const event = this.eventManager.spawnMapEvent();
                    this.sound.play(SfxAssets.mapEvent);
                    this.showEventNotice(event);
                } else if (playerCell.type === "colony") {
                    const event = this.eventManager.spawnColonyEvent();
                    this.sound.play(SfxAssets.mapEvent);
                    this.showEventNotice(event);
                }

                this.global.logTileVisit(playerCell.type);
            }

            // update UI
            this.exploreButton?.setDisabled(!this.canExploreCell(playerCell));
        }

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
                throw `Unable to find WorldCell for x${c.x} y${c.y}`;
            }

            if (disable) {
                wc.off("pointerup");
            } else {
                wc.on("pointerup", () => this.selectSquare(c.x, c.y));
            }

            this.global.worldMap.clearFogOfWar(c.x, c.y);
            wc.setCellState({ isVisitable: !disable, clearFogOfWar: true });
        });
    }

    private scanSurroundings() {
        this.sound.play(SfxAssets.mapScan);
        // uncover fog of war two squares out
        const adjacentCells =
            this.global.worldMap.getPlayerAdjacentCellCoords();
        adjacentCells.forEach((c) => {
            // get all adjacent cells of this cell
            const furtherCells = this.global.worldMap.getAdjacentCellCoords(
                c.x,
                c.y
            );
            furtherCells.forEach((f) => {
                const wc = this.getCell(f.x, f.y);

                if (!wc) {
                    return;
                }

                this.global.worldMap.clearFogOfWar(f.x, f.y);
                wc.setCellState({ clearFogOfWar: true });
            });
        });

        // TODO perhaps tint event/explore/colony tiles?
    }

    private showEventNotice(event: EventOutcome) {
        const message = [
            `${event.message}`,
            `You got: ${JSON.stringify(event.resourceDelta)}`,
        ];
        this.showNotice(message);
    }

    private showNotice(message: string[]) {
        this.noticeBox.setPages([message]).setVisible(true);
    }

    private getCell(x: number, y: number) {
        return this.children.getByName(WorldCell.genName(x, y)) as WorldCell;
    }

    private canExploreCell(cell: Cell) {
        return !cell.playerHasExplored && cell.type === "explorable";
    }

    private completeTutorialStep(step: number) {
        return this.registry.set("tutorialStep", step);
    }

    private getTutorialStep() {
        return (this.registry.get("tutorialStep") as number) || 0;
    }

    private getTutorialCompleted() {
        return this.registry.get("tutorialStep") === 3;
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
