import { CustomScene } from "../objects/CustomScene";
import { WorldCell } from "../objects/WorldMap/WorldCell";
import { WorldAssets } from "../objects/WorldMap/WorldMap";
import { WorldPlayer } from "../objects/WorldMap/WorldPlayer";

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
        this.updateMap(null, null);
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
                    wc.setCellState({ clearFogOfWar: true });
                    this.cameras.main.startFollow(this.player);
                }
            });
        });
    }

    private updateMap(newPX: number | null, newPY: number | null) {
        // don't try to move during init
        if (newPX !== null && newPY !== null) {
            this.updatePlayerAdjacentCells(true);
            this.movePlayerToCoord(newPX, newPY);
        }
        // TODO clear fog of war in wider area?

        this.updatePlayerAdjacentCells(false);
    }

    private movePlayerToCoord(x: number, y: number) {
        const map = this.global.worldMap;
        map.setPlayerPosition(x, y);
        const { x: px, y: py } = this.getCell(x, y).getCenter();
        this.player.setPosition(px, py);
    }

    private updatePlayerAdjacentCells(disable: boolean) {
        const adjCells = this.global.worldMap.getPlayerAdjacentCells();

        adjCells.forEach((c) => {
            const wc = this.getCell(c.x, c.y);

            if (!wc) {
                // TODO ERROR
                return true;
            }

            if (disable) {
                wc.off("pointerup");
            } else {
                wc.on("pointerup", () => this.selectSquare(c.x, c.y));
            }

            wc.setCellState({ isVisitable: !disable, clearFogOfWar: true });
        });
    }

    private getCell(x: number, y: number) {
        return this.children.getByName(WorldCell.genName(x, y)) as WorldCell;
    }

    private selectSquare(x: number, y: number) {
        // TODO if there are not enough resources to move
        if (!this.global.expendMoveResources()) {
            console.log("TODO CANNOT MOVE");
            return false;
        }

        this.updateMap(x, y);
    }
}
