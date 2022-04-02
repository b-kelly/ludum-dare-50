import { AreaMap } from "../objects/AreaMap/AreaMap";
import { AreaPlayer } from "../objects/AreaMap/AreaPlayer";
import { CustomScene } from "../objects/CustomScene";
import { TILE_WIDTH } from "../shared";

const ExploreAssets = {
    tiles: "tiles",
} as const;

export class ExploreScene extends CustomScene {
    static readonly KEY = "ExploreScene";
    private map: AreaMap;
    private tileMap: Phaser.Tilemaps.Tilemap;

    private player: AreaPlayer;

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
