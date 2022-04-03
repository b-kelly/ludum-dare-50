import { CustomScene } from "../CustomScene";
import { Cell } from "./shared";
export declare class WorldCell extends Phaser.GameObjects.Sprite {
    private overlay;
    private hasFogOfWar;
    private isVisitable;
    private cellType;
    constructor(scene: CustomScene, xIndex: number, yIndex: number, cell: Cell);
    setCellState(state: {
        isVisitable?: boolean;
        clearFogOfWar?: boolean;
    }): void;
    private setOverlayState;
    private initEventListeners;
    private hover;
    static genName(x: number, y: number): string;
    private static getRandomSpriteFrame;
}
