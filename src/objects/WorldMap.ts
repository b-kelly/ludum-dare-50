import { CustomScene } from "./CustomScene";

const MAP_WIDTH = 30;
const MAP_HEIGHT = 30;

// TODO
enum CellType {
    Unknown,
}

interface Cell {
    type: CellType;
}
export class WorldMap {
    private _cells: Cell[][];
    private currentPlayerCoords: { x: number; y: number };

    // TODO Deep ReadOnly?
    get cells(): ReadonlyArray<ReadonlyArray<Readonly<Cell>>> {
        return this._cells;
    }

    get playerCoords(): Readonly<WorldMap["currentPlayerCoords"]> {
        return { ...this.currentPlayerCoords };
    }

    constructor() {
        this._cells = this.generateMap();
        this.currentPlayerCoords = {
            x: Math.floor(MAP_WIDTH / 2),
            y: Math.floor(MAP_HEIGHT / 2),
        };
    }

    public cellIsAdjacentToPlayer(x: number, y: number) {
        const px = this.currentPlayerCoords.x;
        const py = this.currentPlayerCoords.y;

        // the current cell is not adjacent
        if (x === px && y === py) {
            return false;
        }

        // check above and below
        if (x === px) {
            if (y === px - 1 || y === px + 1) {
                return true;
            }
        }

        // check upper left/right
        if (y === py) {
            if (x === px - 1 || x === px + 1) {
                return true;
            }
        }

        // check lower left/right
        if (y === py + 1) {
            if (x === px - 1 || x === px + 1) {
                return true;
            }
        }

        return false;
    }

    private generateMap() {
        const map: Cell[][] = [];

        for (let y = 0; y < MAP_HEIGHT; y++) {
            map[y] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                map[y][x] = {
                    type: CellType.Unknown,
                };
            }
        }

        return map;
    }
}

export class WorldCell extends Phaser.GameObjects.Polygon {
    constructor(
        scene: CustomScene,
        xIndex: number,
        yIndex: number,
        cell: Cell
    ) {
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
        super(scene, x, y, [
            0,h2, // P1
            h2,0, // P2
            w2,0, // P3
            width,h2, // P4
            w2,height, // P5
            h2,height, // P6
        ], color);

        this.setOrigin(0, 0).setStrokeStyle(1, 0x000000);
        this.scene.add.existing(this);

        // TODO DEBUG
        this.scene.add
            .text(
                x + h2,
                y + h2,
                `${xIndex},${yIndex} ${CellType[cell.type][0].toUpperCase()}`
            )
            .setOrigin(0.5, 0.5);
    }
}

export class WorldPlayer extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 20, 20, 0xffff00);
        scene.add.existing(this);
    }
}
