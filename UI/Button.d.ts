export declare class Button extends Phaser.GameObjects.Container {
    private isDisabled;
    private buttonImg;
    constructor(scene: Phaser.Scene, options: {
        x: number;
        y: number;
        text: string;
        onClick: () => void;
        size?: "large" | "small";
        disabled?: boolean;
    });
    setOnClick(callback: () => void): void;
    setDisabled(isDisabled: boolean): void;
    private hover;
}
