export declare type ButtonType = "button" | "primary";
export declare class Button extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, options: {
        x: number;
        y: number;
        text: string;
        onClick: () => void;
        width?: number;
        height?: number;
        type?: ButtonType;
    });
    setOnClick(callback: () => void): void;
}
