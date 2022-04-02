export declare class LogScene extends Phaser.Scene {
    static readonly KEY = "LogScene";
    private interactButton;
    private text;
    constructor();
    init(data: {
        text: string[];
    }): void;
    preload(): void;
    create(): void;
    update(): void;
    private scrollDown;
}
