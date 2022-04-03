import { CustomScene } from "../objects/CustomScene";
import { EventOutcome } from "../objects/EventManager";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { DayStartScene } from "./DayStartScene";
import { GameOverScene } from "./GameOverScene";
import { StatusUiScene } from "./StatusUiScene";

export class DayReviewScene extends CustomScene {
    static readonly KEY = "DayReviewScene";
    private dailyHaul: Resources;
    private dailyEventOutcome: EventOutcome;

    constructor() {
        super({ key: DayReviewScene.KEY });
    }

    init(data: { dailyHaul: Resources }) {
        this.dailyHaul = data.dailyHaul;

        // TODO this is safe here?
        // complete this morning's daily event
        this.dailyEventOutcome = this.eventManager.completeDailyEvent();
    }

    preload() {
        this.load.image(
            GeneralAssets.baseBackgroundNight,
            "assets/bg/base-bg-night.png"
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
        // end and finalize the day's results
        const gameOver = this.global.endDay();

        if (gameOver === null) {
            this.scene.start(DayStartScene.KEY);
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
        let message = `${this.dailyEventOutcome.message}`;

        const resources = this.dailyHaul || {};
        Object.entries(resources).forEach((kv, i) => {
            message += `\n${kv[0]}: ${String(kv[1])}`;
        });

        this.add.text(width * 0.25, height * 0.125, message, baseTextOptions);
    }
}
