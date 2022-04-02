import { AreaMap } from "../objects/AreaMap/AreaMap";
import { AreaPlayer } from "../objects/AreaMap/AreaPlayer";
import { AreaSpriteSheet } from "../objects/AreaMap/AreaSpriteSheet";
import { CustomScene } from "../objects/CustomScene";
import { TILE_WIDTH } from "../shared";

export class ExploreAreaScene extends CustomScene {
    static readonly KEY = "ExploreAreaScene";
    private map: AreaMap;
    private tileMap: Phaser.Tilemaps.Tilemap;

    private player: AreaPlayer;

    constructor() {
        super({ key: ExploreAreaScene.KEY });
    }

    init(data: object) {
        console.log(ExploreAreaScene.KEY, data, this.global.resources);
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
    }

    create() {
        this.map = new AreaMap(50, 50);
        this.tileMap = new Phaser.Tilemaps.Tilemap(
            this,
            Phaser.Tilemaps.Parsers.Parse(
                "areamap",
                Phaser.Tilemaps.Formats.ARRAY_2D,
                this.map.toTilemap(),
                TILE_WIDTH,
                TILE_WIDTH,
                false
            )
        );

        const tiles = this.tileMap.addTilesetImage(AreaSpriteSheet.NAME);

        const layer = this.tileMap.createLayer(0, tiles, 0, 0);

        AreaSpriteSheet.getCollisionRanges().forEach(([start, end]) => {
            layer.setCollisionBetween(start, end, true);
        });

        const coords = this.translateCoord(
            this.map.startLocation.x,
            this.map.startLocation.y
        );

        this.player = new AreaPlayer(this, coords.x, coords.y);

        this.physics.add.collider(this.player, layer);

        this.map.DEBUG_displayMap();
    }

    update() {
        this.player.update();
    }

    private translateCoord(xIndex: number, yIndex: number) {
        return {
            x: xIndex * TILE_WIDTH,
            y: yIndex * TILE_WIDTH,
        };
    }
}
