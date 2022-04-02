export declare class LogScene extends Phaser.Scene {
    static readonly KEY = "LogScene";
    private content;
    private interactButton;
    private text;
    private onComplete;
    constructor();
    init(data: {
        text: string[];
        onComplete: () => void;
    }): void;
    preload(): void;
    create(): void;
    update(): void;
    private scrollDown;
    private showNext;
    private debugGenerateText;
}
