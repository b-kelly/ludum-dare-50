import { debugConfig } from "../debug-config";
import { baseTextOptions } from "../shared";
import { Button } from "../UI/Button";
import { BaseScene } from "./BaseScene";
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
        if (process.env.NODE_ENV === "development" && debugConfig.sceneKey) {
            console.warn("LOADING DEBUG CONFIG OVERRIDES");
            this.scene.start(debugConfig.sceneKey, debugConfig.data);
            return;
        }

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
                    onComplete(this: Phaser.Scene) {
                        this.scene.start(BaseScene.KEY);
                    },
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
