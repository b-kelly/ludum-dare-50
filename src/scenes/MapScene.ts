import { CustomScene } from "../objects/CustomScene";
import { WorldCell, WorldPlayer } from "../objects/WorldMap";

export class MapScene extends CustomScene {
    static readonly KEY = "MapScene";

    private player: WorldPlayer;

    constructor() {
        super({ key: MapScene.KEY });
    }

    init(data: object) {
        console.log(MapScene.KEY, data);
    }

    preload() {
        // TODO
    }

    create() {
        this.drawHexMap();
    }

    private drawHexMap() {
        const map = this.global.worldMap;
        const playerCoords = map.playerCoords;
        console.log(playerCoords);

        map.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                const wc = new WorldCell(this, x, y, cell);
                const { x: cx, y: cy } = wc.getCenter();

                if (x === playerCoords.x && y === playerCoords.y) {
                    this.player = new WorldPlayer(this, cx, cy);
                    this.cameras.main.centerOn(cx, cy);
                }

                if (map.cellIsAdjacentToPlayer(x, y)) {
                    wc.setFillStyle(0x0000ff);
                    wc.on("pointerup", () => this.selectSquare(x, y));
                }
            });
        });
    }

    private selectSquare(x: number, y: number) {
        console.log(`Clicked ${x} ${y}`);
    }
}
