import { CustomScene } from "../objects/CustomScene";
import { WorldAssets, WorldCell, WorldPlayer } from "../objects/WorldMap";

export class OverworldScene extends CustomScene {
    static readonly KEY = "OverworldScene";

    private player: WorldPlayer;

    constructor() {
        super({ key: OverworldScene.KEY });
    }

    init(data: object) {
        console.log(OverworldScene.KEY, data);
    }

    preload() {
        this.load.spritesheet(WorldAssets.tiles, "assets/hex-sprites.png", {
            frameWidth: 23 * 8,
            frameHeight: 14 * 8,
        });
    }

    create() {
        this.drawHexMap();
        this.global.worldMap.DEBUG_displayMap();
    }

    private drawHexMap() {
        const map = this.global.worldMap;
        const playerCoords = map.playerCoords;

        map.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                const wc = new WorldCell(this, x, y, cell);
                const { x: cx, y: cy } = wc.getCenter();

                if (x === playerCoords.x && y === playerCoords.y) {
                    this.player = new WorldPlayer(this, cx, cy);
                    this.cameras.main.centerOn(cx, cy);
                }

                if (map.cellIsAdjacentToPlayer(x, y)) {
                    //wc.setFillStyle(0x0000ff);
                    wc.on("pointerup", () => this.selectSquare(x, y));
                }
            });
        });
    }

    private selectSquare(x: number, y: number) {
        console.log(`Clicked ${x} ${y}`);
    }
}
