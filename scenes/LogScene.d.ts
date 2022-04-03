import { CustomScene } from "../objects/CustomScene";
export declare class LogScene extends CustomScene {
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
    private scrollDown;
    private showNext;
}
