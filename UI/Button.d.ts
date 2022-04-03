export declare type ButtonType = "button" | "primary";
export declare class Button extends Phaser.GameObjects.Text {
    private isDisabled;
    constructor(scene: Phaser.Scene, options: {
        x: number;
        y: number;
        text: string;
        onClick: () => void;
        width?: number;
        height?: number;
        type?: ButtonType;
        disabled?: boolean;
    });
    setOnClick(callback: () => void): void;
    setDisabled(isDisabled: boolean): void;
    private hover;
}
