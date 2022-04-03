import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { DayStartScene } from "./DayStartScene";
import { GameOverScene } from "./GameOverScene";
import { StatusUiScene } from "./StatusUiScene";

export class DayReviewScene extends CustomScene {
    static readonly KEY = "DayReviewScene";
    private dailyHaul: Resources;

    constructor() {
        super({ key: DayReviewScene.KEY });
    }

    init(data: { dailyHaul: Resources }) {
        this.dailyHaul = data.dailyHaul;
    }

    preload() {
        this.load.image(
            GeneralAssets.baseBackgroundNight,
            "assets/base-bg-night.png"
        );
    }

    create() {
        // add background
        this.add.image(0, 0, GeneralAssets.baseBackgroundNight).setOrigin(0, 0);
        this.createResourcesDisplay();
        new Button(this, {
            x: 0,
            y: 0,
            text: "Sleep",
            onClick: () => this.sleepAndStartNextDay(),
        });

        if (this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.stop(StatusUiScene.KEY);
        }
    }

    private sleepAndStartNextDay() {
        // spawn a daily event
        const outcome = this.eventManager.spawnDailyEvent();

        // end and finalize the day's results
        const gameOver = this.global.endDay();

        if (gameOver === null) {
            this.scene.start(DayStartScene.KEY, {
                eventOutcome: outcome,
            });
            return;
        }

        this.scene.start(GameOverScene.KEY, {
            type: gameOver,
        });
    }

    private createResourcesDisplay() {
        const { width, height } = this.bounds;

        // resource box TODO HARDCODED COORDS - better way?
        this.add.rectangle(
            width * 0.5,
            height * 0.5,
            width * 0.5,
            height * 0.75,
            0x000000,
            0.5
        );

        const resources = this.dailyHaul || {};
        Object.entries(resources).forEach((kv, i) => {
            const textHeight = 50; // TODO HOW TO GET THIS
            this.add.text(
                width * 0.25,
                height * 0.125 + i * textHeight,
                `${kv[0]}: ${String(kv[1])}`,
                baseTextOptions
            );
        });
    }
}
