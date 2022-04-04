import { AreaMap } from "../objects/AreaMap/AreaMap";
import { AreaPlayer } from "../objects/AreaMap/AreaPlayer";
import { AreaResource } from "../objects/AreaMap/AreaResource";
import { AreaSpriteSheet } from "../objects/AreaMap/AreaSpriteSheet";
import { CustomScene } from "../objects/CustomScene";
import { Cell } from "../objects/WorldMap/shared";
import { GeneralAssets, TILE_WIDTH } from "../shared";
import { Button } from "../UI/Button";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene, STATUS_UI_HEIGHT } from "./StatusUiScene";

export class ExploreAreaScene extends CustomScene {
    static readonly KEY = "ExploreAreaScene";
    private map: AreaMap;
    private tileMap: Phaser.Tilemaps.Tilemap;
    private currentCell: Cell & { x: number; y: number };

    private player: AreaPlayer;

    constructor() {
        super({ key: ExploreAreaScene.KEY });
    }

    init(data: ExploreAreaScene["currentCell"]) {
        super.init(null);
        this.currentCell = data;
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
            GeneralAssets.resources,
            "assets/sprites/resources-tileset.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );
    }

    create() {
        const aSSheet = new AreaSpriteSheet(this.currentCell.biome);

        this.createAnimations();
        this.map = new AreaMap(50, 50, this.currentCell.biome);
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

        const coords = this.translateCoord(
            this.map.startLocation.x,
            this.map.startLocation.y
        );

        this.player = new AreaPlayer(this, coords.x, coords.y);

        this.physics.add.collider(this.player, layer);

        new Button(this, {
            x: 0,
            y: STATUS_UI_HEIGHT,
            text: "Leave",
            onClick: () => this.leaveArea(),
        }).setScrollFactor(0, 0);

        this.spawnResources();

        this.map.DEBUG_displayMap();

        if (!this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.launch(StatusUiScene.KEY);
        }
    }

    update() {
        this.player.update();
    }

    private spawnResources() {
        const resources = this.map.getResources();

        resources.forEach((r) => {
            const coord = this.translateCoord(r.x, r.y);
            const res = new AreaResource(
                this,
                coord.x,
                coord.y,
                r.resource,
                this.currentCell.biome
            );

            this.physics.add.collider(res, this.player, (r: AreaResource) => {
                this.global.adjustHaul({
                    [r.resource]: 1,
                });
                r.destroy();
            });
        });
    }

    private leaveArea() {
        this.fadeToScene(OverworldScene.KEY);
    }

    private translateCoord(xIndex: number, yIndex: number) {
        // swap the y and x so *our* cells match with the tilemap cells
        return this.tileMap.tileToWorldXY(yIndex, xIndex);
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
    }
}
