import { CustomScene } from "../objects/CustomScene";
import { GeneralAssets } from "../shared";
import { TextBox } from "../UI/TextBox";

export class LogScene extends CustomScene {
    static readonly KEY = "LogScene";

    private content: string[][];

    private onComplete: (this: Phaser.Scene) => void;

    constructor() {
        super({ key: LogScene.KEY });
    }

    init(data: { text: string[][]; onComplete: () => void }) {
        this.content = data.text;
        this.onComplete = data.onComplete.bind(this);
    }

    preload() {
        this.load.image(
            GeneralAssets.logBackground,
            "assets/bg/intro-log-bg.gif"
        );
    }

    create() {
        const textBox = new TextBox(this, {
            x: 0,
            y: 0,
            backgroundAsset: this.add
                .image(0, 0, GeneralAssets.logBackground)
                .setOrigin(0, 0),
            pages: this.content,
            padding: 64,
        });

        textBox.on("proceedclick", () => this.onComplete());
    }
}
