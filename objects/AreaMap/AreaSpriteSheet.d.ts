import { CellBiome } from "../WorldMap/shared";
import { CellState } from "./AreaMap";
export declare class AreaSpriteSheet {
    static NAME: string;
    private startingIndex;
    constructor(type: CellBiome);
    getRandomFrameByType(state: CellState): number;
    getRandomCornerFrame(): number;
    getRandomWallFrame(): number;
    getRandomInteriorFrame(): number;
    getRandomPathFrame(): number;
    getRandomLargeStatementFrames(): number[];
    getRandomSmallStatementFrame(): number;
    getCollisionRanges(): number[][];
    private getFrameFromRows;
    private rowStart;
}
