import { AreaCreature } from "../objects/AreaMap/AreaCreature";
import { AreaMap } from "../objects/AreaMap/AreaMap";
import { AreaPlayer } from "../objects/AreaMap/AreaPlayer";
import { AreaResource } from "../objects/AreaMap/AreaResource";
import { AreaSpriteSheet } from "../objects/AreaMap/AreaSpriteSheet";
import { CustomScene } from "../objects/CustomScene";
import { Cell, CellBiome } from "../objects/WorldMap/shared";
import { GeneralAssets, SfxAssets, TILE_WIDTH, UiAssets } from "../shared";
import { Button } from "../UI/Button";
import { TextBox } from "../UI/TextBox";
import { DayReviewScene } from "./DayReviewScene";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene, STATUS_UI_HEIGHT } from "./StatusUiScene";

const PADDING = 8;
export class ExploreAreaScene extends CustomScene {
    static readonly KEY = "ExploreAreaScene";
    private map: AreaMap;
    private tileMap: Phaser.Tilemaps.Tilemap;
    private biome: CellBiome;

    private player: AreaPlayer;
    private creatures: Phaser.GameObjects.Group;
    private leaveButton: Button;

    constructor() {
        super({ key: ExploreAreaScene.KEY });
    }

    init(data: Cell) {
        super.init(null);
        this.biome = data?.biome || "forest";
    }

    preload() {
        this.load.spritesheet(
            AreaSpriteSheet.NAME,
            "assets/sprites/areamap-tileset.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );

        this.load.spritesheet(
            GeneralAssets.areaPlayer,
            "assets/sprites/player.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );

        this.load.spritesheet(
            GeneralAssets.areaEnemies,
            "assets/sprites/enemies.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );

        this.load.spritesheet(
            GeneralAssets.resources,
            "assets/sprites/resources-tileset.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );

        this.load.audio(SfxAssets.bgDesert, "assets/sfx/bg-desert.mp3");
        this.load.audio(SfxAssets.bgForest, "assets/sfx/bg-forest.mp3");
        this.load.audio(SfxAssets.bgWetland, "assets/sfx/bg-wetland.mp3");
        this.load.audio(SfxAssets.grabResource, "assets/sfx/grab-resource.mp3");
        this.load.audio(SfxAssets.enemyHit, "assets/sfx/enemy-hit.mp3");
    }

    create() {
        let bgmKey: string = SfxAssets.bgForest;
        if (this.biome === "desert") {
            bgmKey = SfxAssets.bgDesert;
        } else if (this.biome === "wetland") {
            bgmKey = SfxAssets.bgWetland;
        }
        this.playBgm(bgmKey, {
            loop: true,
        });

        const aSSheet = new AreaSpriteSheet(this.biome);

        this.createAnimations();
        this.map = new AreaMap(50, 50, this.biome);
        this.tileMap = new Phaser.Tilemaps.Tilemap(
            this,
            Phaser.Tilemaps.Parsers.Parse(
                "areamap",
                Phaser.Tilemaps.Formats.ARRAY_2D,
                this.map.toTilemap(aSSheet),
                TILE_WIDTH,
                TILE_WIDTH,
                false
            )
        );

        const tiles = this.tileMap.addTilesetImage(AreaSpriteSheet.NAME);

        const layer = this.tileMap.createLayer(0, tiles, 0, 0);

        aSSheet.getCollisionRanges().forEach(([start, end]) => {
            layer.setCollisionBetween(start, end, true);
        });

        const { width, height } = layer;
        this.physics.world.setBounds(0, 0, width, height);
        this.physics.world.setBoundsCollision();

        // update the sprites
        layer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const cell = this.map.map[tile.x][tile.y];

            if (cell.wallType === "corner") {
                layer.fill(
                    aSSheet.getRandomCornerFrame(),
                    tile.x,
                    tile.y,
                    0,
                    0
                );
            }

            if (cell.rotation) {
                tile.rotation = cell.rotation;
            }
        });

        const coords = this.translateCoord(
            this.map.startLocation.x,
            this.map.startLocation.y
        );

        this.creatures = this.add.group();

        this.player = new AreaPlayer(this, coords.x, coords.y);

        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.creatures, layer);

        this.leaveButton = new Button(this, {
            x: this.bounds.width - PADDING,
            y: this.bounds.height - PADDING,
            text: "Leave",
            onClick: () => this.leaveArea(),
        })
            .setScrollFactor(0, 0)
            .setOrigin(1, 1);

        this.spawnResources();

        this.map.DEBUG_displayMap();

        if (!this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.launch(StatusUiScene.KEY);
        }
    }

    update(time: number) {
        if (!this.scene.isActive) {
            return;
        }

        this.player.update();
        if (this.creatures.children) {
            this.creatures.getChildren().forEach((c) => c.update(time));
        }
    }

    private spawnResources() {
        const resources = this.map.getResources();

        resources.forEach((r) => {
            const coord = this.translateCoord(r.x, r.y);

            if (r.resource === "enemy") {
                const creature = new AreaCreature(
                    this,
                    coord.x,
                    coord.y,
                    this.biome
                );
                this.creatures.add(creature);

                this.physics.add.collider(
                    this.player,
                    creature,
                    (player: AreaPlayer) => {
                        if (player.damage(this.time.now)) {
                            this.sound.play(SfxAssets.enemyHit);

                            if (
                                this.global.damagePlayer(
                                    AreaCreature.DAMAGE_AMOUNT
                                )
                            ) {
                                this.killPlayer();
                            }
                        }
                    }
                );
            } else {
                const res = new AreaResource(
                    this,
                    coord.x,
                    coord.y,
                    r.resource,
                    this.biome
                );

                this.physics.add.collider(
                    res,
                    this.player,
                    (r: AreaResource) => {
                        this.sound.play(SfxAssets.grabResource);
                        this.global.adjustHaul({
                            [r.resource]: 1,
                        });
                        r.destroy();
                    }
                );
            }
        });
    }

    private leaveArea() {
        this.fadeToScene(OverworldScene.KEY);
    }

    private translateCoord(xIndex: number, yIndex: number) {
        // swap the y and x so *our* cells match with the tilemap cells
        return this.tileMap.tileToWorldXY(yIndex, xIndex);
    }

    private killPlayer() {
        this.player.destroy();
        this.leaveButton.setDisabled(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const text = this.cache.json.get(GeneralAssets.narration)
            .faint_notice as string[];
        new TextBox(this, {
            x: PADDING,
            y: STATUS_UI_HEIGHT,
            backgroundAsset: this.add.image(0, 0, UiAssets.tutorialPane),
            buttonText: "Back to base",
            padding: 64,
            pages: [text],
            buttonAlign: "center",
        })
            .setScrollFactor(0, 0, true)
            .on("proceedclick", () => {
                this.fadeToScene(DayReviewScene.KEY, {
                    dailyHaul: this.global.currentDay.haul,
                });
            });
        // popup
        // transition
    }

    private createAnimations() {
        this.anims.create({
            key: "player_walk",
            frameRate: 5,
            frames: this.anims.generateFrameNumbers(GeneralAssets.areaPlayer, {
                frames: [0, 1, 0, 2],
            }),
            repeat: -1,
        });

        // creatures
        this.anims.create({
            key: "areacreature_wetland",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers(GeneralAssets.areaEnemies, {
                start: 0,
                end: 3,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "areacreature_desert",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers(GeneralAssets.areaEnemies, {
                start: 4,
                end: 7,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "areacreature_forest",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers(GeneralAssets.areaEnemies, {
                start: 8,
                end: 11,
            }),
            repeat: -1,
        });
        this.anims.create({
            key: "areacreature_generic",
            frameRate: 3,
            frames: this.anims.generateFrameNumbers(GeneralAssets.areaEnemies, {
                start: 12,
                end: 15,
            }),
            repeat: -1,
        });
    }
}
