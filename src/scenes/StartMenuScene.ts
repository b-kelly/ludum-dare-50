import { debugConfig } from "../debug-config";
import { DEBUG_isDebugBuild, GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { BaseScene } from "./BaseScene";
import { LogScene } from "./LogScene";

export class StartMenuScene extends Phaser.Scene {
    static readonly KEY = "StartMenuScene";

    constructor() {
        super({ key: StartMenuScene.KEY });
    }

    preload() {
        this.load.image(
            GeneralAssets.startBackground,
            "assets/title-screen.png"
        );
        this.load.json(GeneralAssets.narration, "assets/narration.json");
    }

    create() {
        if (DEBUG_isDebugBuild() && debugConfig.sceneKey) {
            console.warn("LOADING DEBUG CONFIG OVERRIDES");
            this.scene.start(debugConfig.sceneKey, debugConfig.data);
            return;
        }

        this.add.image(0, 0, GeneralAssets.startBackground).setOrigin(0, 0);

        new Button(this, {
            x: 300,
            y: 550,
            text: "Start",
            onClick: () => this.launchGame(),
        });
    }

    private launchGame() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const text = this.cache.json.get(GeneralAssets.narration)
            .intro as string[];
        this.scene.start(LogScene.KEY, {
            text: text,
            onComplete(this: Phaser.Scene) {
                this.scene.start(BaseScene.KEY);
            },
        });
    }
}
