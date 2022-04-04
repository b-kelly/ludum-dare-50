import { CustomScene } from "../objects/CustomScene";
import { EventOutcome } from "../objects/EventManager";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets, UiAssets } from "../shared";
import { Button } from "../UI/Button";
import { DayStartScene } from "./DayStartScene";
import { GameOverScene } from "./GameOverScene";
import { StatusUiScene } from "./StatusUiScene";

const PADDING = 48;
const ELPADDING = 8;
export class DayReviewScene extends CustomScene {
    static readonly KEY = "DayReviewScene";
    private dailyHaul: Resources;
    private dailyEventOutcome: EventOutcome;

    constructor() {
        super({ key: DayReviewScene.KEY });
    }

    init(data: { dailyHaul: Resources }) {
        super.init(data);
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
        this.load.image(
            UiAssets.portraitPane,
            "assets/ui/portrait-text.png"
        );
        this.load.spritesheet(
            GeneralAssets.characterPortraits,
            "assets/sprites/portrait-spritesheet.png",
            {
                frameWidth: 200,
                frameHeight: 200
            }
        );
    }

    create() {
        // add background
        const img = this.add
            .image(0, 0, GeneralAssets.baseBackgroundNight)
            .setOrigin(0, 0);

        const pane = this.add.image(
            img.width / 2,
            img.height / 2,
            UiAssets.briefingPane
        );

        const paneX = PADDING + pane.x - pane.width / 2;
        const paneY = PADDING + pane.y - pane.height / 2;
        const paneWidth = pane.width - PADDING * 2 - PADDING / 2;
        const paneHeight = pane.height - PADDING * 2;

        const title = this.add
            .text(
                paneX + paneWidth / 2,
                paneY,
                `13th Mission to Kepler 22B - Day ${31 + this.global.campaignStats.dayCount
                }`,
                {
                    ...baseTextOptions,
                }
            )
            .setOrigin(0.5, 0);

        const sectionTitle = this.add
            .text(
                paneX + paneWidth / 2,
                title.y + title.height + ELPADDING,
                `Debrief`,
                {
                    ...baseTextOptions,
                }
            )
            .setOrigin(0.5, 0);

        let prevHeight = sectionTitle.height + ELPADDING;
        prevHeight +=
            this.generateRow(
                paneX,
                sectionTitle.y + prevHeight,
                paneWidth / 3,
                null
            ).height + ELPADDING;

        Object.keys(this.global.resources).forEach((k: keyof Resources) => {
            prevHeight +=
                this.generateRow(
                    paneX,
                    sectionTitle.y + prevHeight,
                    paneWidth / 3,
                    k
                ).height + ELPADDING;
        });

        const portrait = this.add.image(
            pane.x - pane.width / 2 + PADDING + ELPADDING,
            pane.y / 2 + prevHeight - PADDING,
            UiAssets.portraitPane
        ).setOrigin(0, 0);

        const character = this.global.currentDay.dailyEvent?.character || "kiran";
        let characterNum = 0;
        let characterText = "Commanding Officer Kiran Adam";

        switch (character) {
            case "kiran":
                characterNum = 0;
                characterText = "Commanding Officer Kiran Adam";
                break;
            case "adzo":
                characterNum = 1;
                characterText = "Agricultural Officer Adzo Loman";
                break;
            case "shreya":
                characterNum = 2;
                characterText = "Agricultural Specialist Shira Loman";
                break;
            case "kamal":
                characterNum = 5;
                characterText = "Philosophy Specialist Kamal Marion";
                break;
            case "lufti":
                characterNum = 3;
                characterText = "Kepler-22b Expert Lufti Andela";
                break;
            case "harish":
                characterNum = 7;
                characterText = "Medical Officer Harish Kuroda";
                break;
            case "annika":
                characterNum = 6;
                characterText = "Comms Specialist Annika Villalobos";
                break;
            case "gaston":
                characterNum = 8;
                characterText = "Logistics Specialist Gaston Fisher";
                break;
            case "martin":
                characterNum = 9;
                characterText = "Logistics Specialist Martin Fisher";
                break;
            case "britt":
                characterNum = 10;
                characterText = "Botanist Britt Saarinen";
                break;
            case "girish":
                characterNum = 11;
                characterText = "Botanist Girish Martell";
                break;
            case "sachin":
                characterNum = 13;
                characterText = "Medical Assistant Sachin Traves";
                break;
            case "chip":
                characterNum = 12;
                characterText = "Engineer Chip O'Dell";
                break;
            case "dora":
                characterNum = 14;
                characterText = "Engineer Dora Hintzen";
                break;
            case "marcel":
                characterNum = 15;
                characterText = "Artist Marcel Kralij";
                break;
            case "rupert":
                characterNum = 4;
                characterText = "Engineering Specialist Rupert Luan";
                break;
            default:
                break;
        }

        const characterPortrait = this.add.image(
            portrait.x + 114,
            portrait.y + 116,
            GeneralAssets.characterPortraits,
            characterNum
        );

        let placeholderText = characterText + ": " + "”Good job today, EXL.”";
        if (this.dailyEventOutcome?.message != null) {
            placeholderText = characterText + ": ”" + this.dailyEventOutcome?.message + "”";
        }

        const dialogue = this.add.text(
            paneX + portrait.width + ELPADDING + 8,
            sectionTitle.y + sectionTitle.height + prevHeight + ELPADDING,
            placeholderText,
            {
                ...baseTextOptions,
                fontSize: "14pt",
                wordWrap: {
                    width: paneWidth - portrait.width + PADDING,
                },
            }
        );

        new Button(this, {
            x: paneX + paneWidth / 2,
            y: paneY + paneHeight - PADDING,
            text: "Sleep",
            onClick: () => this.sleepAndStartNextDay(),
        }).setOrigin(0.5, 0);

        if (this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.stop(StatusUiScene.KEY);
        }
    }

    private sleepAndStartNextDay() {
        // end and finalize the day's results
        const gameOver = this.global.endDay();

        if (gameOver === null) {
            this.fadeToScene(DayStartScene.KEY);
            return;
        }

        this.fadeToScene(GameOverScene.KEY, {
            type: gameOver,
        });
    }

    private generateRow(
        x: number,
        y: number,
        sectionWidth: number,
        resource: keyof Resources
    ) {
        const textConfig = {
            ...baseTextOptions,
            fontSize: "14pt",
        };

        let text = this.add.text(x, y, resource, textConfig).setOrigin(0, 0);

        text.x += sectionWidth - text.width - ELPADDING;

        // divider
        let divider = this.add
            .rectangle(
                x + sectionWidth,
                y,
                2,
                text.height + ELPADDING,
                0x000000
            )
            .setOrigin(0, 0);

        // TODO align numbers / signs
        let deltaCountText = "Gathered today";
        if (resource) {
            const count = this.dailyHaul?.[resource] || 0;
            const eventDelta =
                this.dailyEventOutcome?.resourceDelta?.[resource] || 0;
            deltaCountText = `${count < 0 ? "-" : "+"} ${Math.abs(count)}`;

            if (eventDelta !== 0) {
                deltaCountText += ` ${eventDelta < 0 ? "-" : "+"} ${Math.abs(
                    eventDelta
                )}`;
            }
        }

        text = this.add.text(
            divider.x + divider.width,
            divider.y,
            deltaCountText,
            textConfig
        );
        text.x += sectionWidth - text.width - ELPADDING;

        divider = this.add
            .rectangle(
                x + sectionWidth + sectionWidth,
                y,
                2,
                text.height + ELPADDING,
                0x000000
            )
            .setOrigin(0, 0);

        let storageCountText = "Total stored";
        if (resource) {
            const stat = this.global.baseStatus;
            storageCountText = `${this.global.resources[resource]} / ${stat.maxStorage[resource]}`;
        }

        // TODO align numbers / signs
        text = this.add.text(
            divider.x + divider.width,
            divider.y,
            storageCountText,
            textConfig
        );
        text.x += sectionWidth - text.width - ELPADDING;

        return text;
    }
}
