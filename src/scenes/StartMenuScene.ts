import { baseTextOptions } from "../shared";
import { Button } from "../UI/Button";
import { LogScene } from "./LogScene";

export class StartMenuScene extends Phaser.Scene {
    static readonly KEY = "StartMenuScene";

    constructor() {
        super({ key: StartMenuScene.KEY });
    }

    preload() {
        // TODO
    }

    create() {
        const text = this.add.text(
            0,
            0,
            "Delay the inevitable",
            baseTextOptions
        );

        new Button(this, {
            x: 0,
            y: text.displayHeight,
            text: "Start",
            onClick: () => {
                this.scene.start(LogScene.KEY, {
                    text: this.fetchOpeningScript(),
                });
            },
        });
    }

    private fetchOpeningScript() {
        // TODO fetch from disk? json file?
        return [
            "Some stuff happened.",
            "Then some other stuff happened.",
            "And now you're here.",
        ];
    }
}
