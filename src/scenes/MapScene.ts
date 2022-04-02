import { CustomScene } from "../objects/CustomScene";

export class MapScene extends CustomScene {
    static readonly KEY = "MapScene";

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

        map.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                this.drawHexagon(x, y);
            });
        });
    }

    private drawHexagon(xIndex: number, yIndex: number) {
        // Time to do some trig to find the point coords!
        // Actually, no thank you, I'll cheat since they're hardcoded
        // (Sorry Mrs. Smith, I never was good at showing my work)
        const height = 14 * 4;
        const width = 22 * 4;
        const h2 = height / 2;
        const w2 = width - h2;

        const x = width * xIndex - h2 * xIndex;
        let y = height * yIndex;

        if (xIndex % 2) {
            y += h2;
        }

        let color = 0xff0000;

        if (yIndex % 2) {
            color = 0x00ff00;
        }

        // prettier-ignore
        this.add.polygon(x, y, [
            0,h2, // P1
            h2,0, // P2
            w2,0, // P3
            width,h2, // P4
            w2,height, // P5
            h2,height, // P6
        ], color).setOrigin(0, 0).setStrokeStyle(1, 0x000000);
    }
}
