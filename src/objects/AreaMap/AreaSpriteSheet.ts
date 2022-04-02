import { CellType } from "../WorldMap/shared";
import { CellState } from "./AreaMap";

const TILES_SHEET_WIDTH = 6;

/*
 * Sheet contains multiple grids, each is:
 * 6x9 grid, rows are all same facing, random pattern choice
 * Row 0 top-left corner (needs rotation)
 * Row 1 top edge (needs rotation)
 * Row 2-3 interior
 * Row 4-5 path
 * Row 6-7 2x2 statement objects (fills in interior)
 * Row 8 1x1 statement objects (fills in interior)
 *
 * randomly rotate interior tiles
 * path tiles rotate
 */
export class AreaSpriteSheet {
    static NAME = "AreaSpriteSheet";

    private startingIndex = 0;

    constructor(type: CellType) {
        // TODO change starting index
    }

    getRandomFrameByType(state: CellState) {
        if (state === CellState.Open) {
            return this.getRandomPathFrame();
        } else if (state === CellState.Filled) {
            return this.getRandomInteriorFrame();
        } else if (state === CellState.Wall) {
            return this.getRandomWallFrame();
        }

        throw "You should never see this";
    }

    getRandomCornerFrame() {
        return this.getFrameFromRows(0, 1);
    }

    getRandomWallFrame() {
        return this.getFrameFromRows(1, 1);
    }

    getRandomInteriorFrame() {
        return this.getFrameFromRows(2, 2);
    }

    getRandomPathFrame() {
        return this.getFrameFromRows(4, 1);
    }

    getRandomLargeStatementFrames() {
        const item = Phaser.Math.RND.integerInRange(0, TILES_SHEET_WIDTH / 2);
        const rowNum = 6;
        // TODO CELLTYPE START OFFSET
        const startIndex1 = rowNum * TILES_SHEET_WIDTH;
        const startIndex2 = (rowNum + 1) * TILES_SHEET_WIDTH;

        return [
            startIndex1 + item, // top left
            startIndex1 + item + 1, // top right
            startIndex2 + item, // bottom left
            startIndex2 + item + 1, // bottom right
        ];
    }

    getRandomSmallStatementFrame() {
        return this.getFrameFromRows(8, 1);
    }

    private getFrameFromRows(rowNum: number, rowCount: number) {
        // TODO CELLTYPE START OFFSET
        const rowStartIndex = rowNum * TILES_SHEET_WIDTH;
        return Phaser.Math.RND.integerInRange(
            rowStartIndex,
            rowStartIndex + TILES_SHEET_WIDTH * rowCount
        );
    }
}
