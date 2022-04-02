import { AreaMap } from "../objects/AreaMap";
import { CustomScene } from "../objects/CustomScene";
import { TILE_WIDTH } from "../shared";

const ExploreAssets = {
    tiles: "tiles",
} as const;

export class ExploreScene extends CustomScene {
    static readonly KEY = "ExploreScene";
    private map: AreaMap;
    private tileMap: Phaser.Tilemaps.Tilemap;

    private player: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: ExploreScene.KEY });
    }

    init(data: object) {
        console.log(ExploreScene.KEY, data, this.global.resources);
    }

    preload() {
        this.load.spritesheet(ExploreAssets.tiles, "assets/tiles.png", {
            frameWidth: TILE_WIDTH,
            frameHeight: TILE_WIDTH,
        });
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

        const tiles = this.tileMap.addTilesetImage(ExploreAssets.tiles);

        const layer = this.tileMap.createLayer(0, tiles, 0, 0);
        layer.setCollision([0], false);
        layer.setCollisionByExclusion([0], true);

        const coords = this.translateCoord(
            this.map.startLocation.x,
            this.map.startLocation.y
        );
        this.player = this.add
            .rectangle(coords.x, coords.y, TILE_WIDTH, TILE_WIDTH, 0xff0000)
            .setOrigin(0, 0);
        this.cameras.main.startFollow(this.player);

        this.map.DEBUG_displayMap();
    }

    private translateCoord(xIndex: number, yIndex: number) {
        return {
            x: xIndex * TILE_WIDTH,
            y: yIndex * TILE_WIDTH,
        };
    }
}
