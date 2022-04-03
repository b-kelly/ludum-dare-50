import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene } from "./StatusUiScene";

export class DayStartScene extends CustomScene {
    static readonly KEY = "DayStartScene";
    private eventMessage: string;
    private eventModifiers: Resources;

    constructor() {
        super({ key: DayStartScene.KEY });
    }

    init(data: { eventMessage: string; eventModifiers: Resources }) {
        this.eventMessage = data.eventMessage;
        this.eventModifiers = data.eventModifiers;
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
            text: "Next",
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

        if (this.eventMessage) {
            this.add.text(startXPos, startYPos, this.eventMessage);
            startYPos += textHeight;
        }

        const resources = this.global.resources;
        Object.entries(resources).forEach(
            (kv: [keyof Resources, number], i) => {
                let message = `${kv[0]}: ${String(kv[1])}`;

                const modifier = this.eventModifiers?.[kv[0]];
                if (modifier) {
                    message += ` ${modifier}`;
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
