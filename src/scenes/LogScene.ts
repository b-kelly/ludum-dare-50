import { baseTextOptions } from "../shared";
import { Button } from "../UI/Button";
import { BaseScene } from "./BaseScene";

export class LogScene extends Phaser.Scene {
    static readonly KEY = "LogScene";

    private content: string[];

    private interactButton: Button;
    private text: Phaser.GameObjects.Text;

    private onComplete: () => void;

    constructor() {
        super({ key: LogScene.KEY });
    }

    init(data: { text: string[]; onComplete: () => void }) {
        // TODO DEBUG
        if (!data?.text) {
            data = {
                text: this.debugGenerateText(),
                onComplete: () => {
                    this.scene.start(BaseScene.KEY, {});
                },
            };
        }

        this.content = data.text;
        this.onComplete = data.onComplete;
    }

    preload() {
        // TODO
    }

    create() {
        const { width, height } = this.cameras.main;

        const graphics = this.make.graphics({});
        graphics.fillRect(0, 0, width, height);
        const mask = new Phaser.Display.Masks.GeometryMask(this, graphics);

        this.text = this.add
            .text(0, 0, this.content, {
                ...baseTextOptions,
                wordWrap: { width: width },
            })
            .setOrigin(0);
        this.text.setMask(mask);

        this.interactButton = new Button(this, {
            x: width,
            y: height,
            text: "▼",
            onClick: () => {
                this.scrollDown();
            },
        });
        this.interactButton.setOrigin(1, 1);
    }

    update(/*time: number*/) {
        /* TODO update all the things */
    }

    // TODO scroll up?
    private scrollDown() {
        this.text.y -= 100; // TODO what's the height of one line?
        this.showNext();
    }

    private showNext() {
        if (this.text.y * -1 >= this.text.height - this.cameras.main.height) {
            this.interactButton.text = "Next";
            this.interactButton.setOnClick(() => {
                this.onComplete();
            });
        }
    }

    private debugGenerateText() {
        const text = [];

        // generate a bunch of lines
        for (let i = 0; i < 25; i++) {
            text.push(
                `(${i}) Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, maiores!`
            );
        }

        return text;
    }
}
