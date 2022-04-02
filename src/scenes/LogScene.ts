import { Button } from "../UI/Button";

export class LogScene extends Phaser.Scene {
    static readonly KEY = "LogScene";

    private interactButton: Button;
    private text: string[];

    constructor() {
        super({ key: LogScene.KEY });
    }

    init(data: { text: string[] }) {
        this.text = data.text;
    }

    preload() {
        // TODO
    }

    create() {
        this.interactButton = new Button(this, {
            x: 0,
            y: 0,
            text: "▼",
            onClick: () => {
                this.scrollDown();
            },
        });
    }

    update(/*time: number*/) {
        /* TODO update all the things */
    }

    // TODO scroll up?
    private scrollDown() {
        // TODO
    }
}
