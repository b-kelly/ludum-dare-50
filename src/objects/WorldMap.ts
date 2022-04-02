import { CustomScene } from "./CustomScene";

const MAP_WIDTH = 30;
const MAP_HEIGHT = 30;

// TODO
enum CellType {
    Empty,
    Colony,
    Forest,
    Desert,
    Wetland,
}

const cellTypeSpawnData: Record<
    CellType,
    {
        spawnRate: number;
        clusterSizeUpper: number;
        clusterSizeLower: number;
    }
> = {
    [CellType.Empty]: null,
    [CellType.Colony]: {
        spawnRate: 0,
        clusterSizeUpper: 1,
        clusterSizeLower: 1,
    },
    [CellType.Forest]: {
        spawnRate: 0.025,
        clusterSizeUpper: 1,
        clusterSizeLower: 1,
    },
    [CellType.Desert]: {
        spawnRate: 0.025,
        clusterSizeUpper: 1,
        clusterSizeLower: 1,
    },
    [CellType.Wetland]: {
        spawnRate: 0.025,
        clusterSizeUpper: 1,
        clusterSizeLower: 1,
    },
} as const;

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
                    type: this.pickCellType(),
                };
            }
        }

        // randomly distribute seeds

        return map;
    }

    private pickCellType() {
        //
        cellTypeSpawnData;
        return CellType.Empty;
    }

    public DEBUG_displayMap(): void {
        const display = document.querySelector<HTMLCanvasElement>(".js-map");
        display.classList.remove("hide-debug");
        const map = this._cells;

        const ctx = display.getContext("2d");
        const width = 10;
        const scale = 4; // increase this to make the display physically larger, scaling the canvas view to match
        const ctxScale = (1 / width) * scale;

        display.width = MAP_WIDTH * scale;
        display.height = MAP_HEIGHT * scale;
        ctx.scale(ctxScale, ctxScale);

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                const cell = map[i][j];
                switch (cell.type) {
                    case CellType.Empty:
                        ctx.fillStyle = "white";
                        break;
                    case CellType.Colony:
                        ctx.fillStyle = "black";
                        break;
                    case CellType.Desert:
                        ctx.fillStyle = "yellow";
                        break;
                    case CellType.Forest:
                        ctx.fillStyle = "green";
                        break;
                    case CellType.Wetland:
                        ctx.fillStyle = "blue";
                        break;
                    default:
                        ctx.fillStyle = "black";
                }

                ctx.fillRect(i * width, j * width, width, width);
            }
        }

        // draw the player start pos
        ctx.fillStyle = "hotpink";
        const playerWidth = width / 2; // show some of the square behind the player for debugging
        ctx.fillRect(
            this.currentPlayerCoords.x * width + playerWidth / 2,
            this.currentPlayerCoords.y * width + playerWidth / 2,
            playerWidth,
            playerWidth
        );
    }
}

export class WorldCell extends Phaser.GameObjects.Polygon {
    private prevFillStyle: number;

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

        this.initEventListeners();

        // TODO DEBUG
        this.scene.add
            .text(
                x + h2,
                y + h2,
                `${xIndex},${yIndex} ${CellType[cell.type][0].toUpperCase()}`
            )
            .setOrigin(0.5, 0.5);
    }

    private initEventListeners() {
        this.setInteractive();
        this.on("pointerover", () => this.hover(true)).on("pointerout", () =>
            this.hover(false)
        );
    }

    private hover(hasEntered: boolean) {
        if (hasEntered) {
            this.prevFillStyle = this.fillColor;
        }

        this.setFillStyle(hasEntered ? 0xffffff : this.prevFillStyle);
    }
}

export class WorldPlayer extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 20, 20, 0xffff00);
        scene.add.existing(this);
    }
}
