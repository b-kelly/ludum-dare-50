import { AreaMap } from "../objects/AreaMap/AreaMap";
import { AreaPlayer } from "../objects/AreaMap/AreaPlayer";
import { AreaSpriteSheet } from "../objects/AreaMap/AreaSpriteSheet";
import { CustomScene } from "../objects/CustomScene";
import { Cell } from "../objects/WorldMap/shared";
import { GeneralAssets, TILE_WIDTH } from "../shared";
import { Button } from "../UI/Button";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene } from "./StatusUiScene";

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
        this.currentCell = data;
        console.log(data);
    }

    preload() {
        this.load.spritesheet(
            AreaSpriteSheet.NAME,
            "assets/explore-tileset.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );

        this.load.spritesheet(
            GeneralAssets.areaPlayer,
            "assets/exl-topdown.png",
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

        const coords = this.translateCoord(
            this.map.startLocation.x,
            this.map.startLocation.y
        );

        const { width, height } = layer;
        this.physics.world.setBounds(0, 0, width, height);
        this.physics.world.setBoundsCollision();

        this.player = new AreaPlayer(this, coords.x, coords.y);

        this.physics.add.collider(this.player, layer);

        new Button(this, {
            x: 0,
            y: 50,
            text: "Leave",
            onClick: () => this.leaveArea(),
        }).setScrollFactor(0, 0);

        this.map.DEBUG_displayMap();

        if (!this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.launch(StatusUiScene.KEY);
        }
    }

    update() {
        this.player.update();
    }

    private leaveArea() {
        this.scene.start(OverworldScene.KEY);
    }

    private translateCoord(xIndex: number, yIndex: number) {
        return {
            x: xIndex * TILE_WIDTH,
            y: yIndex * TILE_WIDTH,
        };
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
