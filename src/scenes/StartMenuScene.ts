import { debugConfig } from "../debug-config";
import { CustomScene } from "../objects/CustomScene";
import { WebFontFile } from "../objects/WebFontFile";
import {
    DEBUG_isDebugBuild,
    GeneralAssets,
    SfxAssets,
    UiAssets,
} from "../shared";
import { Button } from "../UI/Button";
import { DayStartScene } from "./DayStartScene";
import { LogScene } from "./LogScene";

export class StartMenuScene extends CustomScene {
    static readonly KEY = "StartMenuScene";

    constructor() {
        super({ key: StartMenuScene.KEY });
    }

    preload() {
        this.load.image(
            GeneralAssets.startBackground,
            "assets/bg/title-screen-bg.png"
        );
        // load "Exo 2" from Google Fonts using WebFontLoader
        this.load.addFile(new WebFontFile(this.load, "Exo+2"));
        // UI assets
        this.load.image(UiAssets.arrowLeft, "assets/ui/arrow-left.png");
        this.load.image(UiAssets.arrowRight, "assets/ui/arrow-right.png");
        this.load.image(UiAssets.buttonLg, "assets/ui/button-lg.png");
        this.load.image(UiAssets.buttonSm, "assets/ui/button-sm.png");
        this.load.image(
            UiAssets.briefingPane,
            "assets/ui/daily-briefing-pane.png"
        );
        this.load.image(UiAssets.topbar, "assets/ui/top-bar.png");
        this.load.image(UiAssets.tutorialPane, "assets/ui/tutorial-pane.png");

        // audio/sfx

        this.load.audio(
            SfxAssets.bgIntroOverworld.key,
            "assets/sfx/bg-intro-overworld.mp3"
        );
        this.load.audio(SfxAssets.click.key, "assets/sfx/click.mp3");

        // json data
        this.load.json(GeneralAssets.narration, "assets/narration.json");
        this.load.json(GeneralAssets.events, "assets/events.json");
    }

    create() {
        this.DEBUG_ACTIONS();

        this.sound.play(SfxAssets.bgIntroOverworld.key);

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
        this.fadeToScene(
            LogScene.KEY,
            {
                text: text,
                onComplete(this: CustomScene) {
                    this.fadeToScene(DayStartScene.KEY, null);
                },
            },
            true
        );
    }

    private DEBUG_ACTIONS() {
        if (!DEBUG_isDebugBuild()) {
            return;
        }

        if (debugConfig.skipTutorial) {
            this.registry.set("tutorialStep", 3);
        }

        if (debugConfig.sceneKey) {
            console.warn("LOADING DEBUG CONFIG OVERRIDES");
            this.fadeToScene(debugConfig.sceneKey, debugConfig.data);
            return;
        }
    }
}
