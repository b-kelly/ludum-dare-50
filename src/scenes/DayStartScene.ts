import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene } from "./StatusUiScene";

export class DayStartScene extends CustomScene {
    static readonly KEY = "DayStartScene";

    constructor() {
        super({ key: DayStartScene.KEY });
    }

    init() {
        // TODO is this safe here? It won't run too many times?
        this.global.startDay();
    }

    preload() {
        this.load.image(GeneralAssets.baseBackgroundDay, "assets/base-bg.png");
    }

    create() {
        // add background
        this.add.image(0, 0, GeneralAssets.baseBackgroundDay).setOrigin(0, 0);
        this.createResourcesDisplay();
        new Button(this, {
            x: 0,
            y: 0,
            text: "Explore",
            onClick: () => {
                this.scene.start(OverworldScene.KEY, {});
            },
        });

        if (this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.stop(StatusUiScene.KEY);
        }
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
        const textHeight = 50; // TODO HOW TO GET THIS

        const startXPos = width * 0.25;
        let startYPos = height * 0.125;

        const dailyEvent = this.global.currentDay.dailyEvent;

        if (dailyEvent?.morningMessage) {
            this.add.text(startXPos, startYPos, dailyEvent.morningMessage);
            startYPos += textHeight;
        }

        const currentResources = this.global.resources;
        const startingResources = currentResources;
        const stat = this.global.baseStatus;
        Object.entries(startingResources).forEach(
            (kv: [keyof Resources, number], i) => {
                const key = kv[0];
                const message = `${key}: ${String(kv[1])} (+${
                    stat.dailyReplenish[key]
                }) / ${stat.maxStorage[key]}`;

                this.add.text(
                    startXPos,
                    startYPos + i * textHeight,
                    message,
                    baseTextOptions
                );
            }
        );
    }
}
