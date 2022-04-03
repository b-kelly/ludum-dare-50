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
        switch (type) {
            case CellType.Desert:
                // starts on row 9
                this.startingIndex = 9 * TILES_SHEET_WIDTH;
                break;
            case CellType.Wetland:
                // starts on row 18
                this.startingIndex = 18 * TILES_SHEET_WIDTH;
                break;
            case CellType.Forest:
            default:
                this.startingIndex = 0;
                break;
        }
    }

    getRandomFrameByType(state: CellState) {
        if (state === CellState.Open) {
            return this.getRandomPathFrame();
        } else if (state === CellState.Filled) {
            return this.getRandomInteriorFrame();
        } else if (state === CellState.Wall) {
            return this.getRandomWallFrame();
        } else if (state === CellState.Resource) {
            return this.getRandomSmallStatementFrame(); // TODO RESOURCE IMAGE
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
        const startIndex1 = this.rowStart(rowNum);
        const startIndex2 = this.rowStart(rowNum + 1);

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

    getCollisionRanges() {
        // rows 0,1,2,3,6,7,8
        return [
            [this.rowStart(0), this.rowStart(4) - 1],
            [this.rowStart(6), this.rowStart(9)],
        ];
    }

    private getFrameFromRows(rowNum: number, rowCount: number) {
        const rowStartIndex = this.rowStart(rowNum);
        return Phaser.Math.RND.integerInRange(
            rowStartIndex,
            rowStartIndex + TILES_SHEET_WIDTH * rowCount
        );
    }

    private rowStart(rowNum: number) {
        return rowNum * TILES_SHEET_WIDTH + this.startingIndex;
    }
}
