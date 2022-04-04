export declare class Button extends Phaser.GameObjects.Container {
    private isDisabled;
    private buttonImg;
    get height(): number;
    get width(): number;
    constructor(scene: Phaser.Scene, options: {
        x: number;
        y: number;
        text: string;
        onClick: () => void;
        size?: "large" | "small";
        disabled?: boolean;
    });
    setOrigin(x: number, y: number): this;
    setOnClick(callback: () => void): void;
    setDisabled(isDisabled: boolean): void;
    private hover;
}
