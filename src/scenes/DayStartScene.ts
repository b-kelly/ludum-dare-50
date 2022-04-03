import { CustomScene } from "../objects/CustomScene";
import { EventOutcome } from "../objects/EventManager";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene } from "./StatusUiScene";

export class DayStartScene extends CustomScene {
    static readonly KEY = "DayStartScene";
    private eventOutcome: EventOutcome;

    constructor() {
        super({ key: DayStartScene.KEY });
    }

    init(data: { eventOutcome: EventOutcome }) {
        this.eventOutcome = data.eventOutcome;
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

        if (this.eventOutcome?.message) {
            this.add.text(startXPos, startYPos, this.eventOutcome.message);
            startYPos += textHeight;
        }

        const currentResources = this.global.resources;
        const startingResources =
            this.eventOutcome?.resourcesPrior || currentResources;
        Object.entries(startingResources).forEach(
            (kv: [keyof Resources, number], i) => {
                let message = `${kv[0]}: ${String(kv[1])}`;

                const modifier = this.eventOutcome?.resourceDelta?.[kv[0]];
                if (modifier) {
                    message += ` ${modifier} = ${currentResources[kv[0]]}`;
                }

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
