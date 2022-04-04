import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets, UiAssets } from "../shared";
import { Button } from "../UI/Button";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene } from "./StatusUiScene";

const PADDING = 48;
const ELPADDING = 16;

export class DayStartScene extends CustomScene {
    static readonly KEY = "DayStartScene";

    constructor() {
        super({ key: DayStartScene.KEY });
    }

    init() {
        super.init(null);
        // TODO is this safe here? It won't run too many times?
        this.global.startDay();
    }

    preload() {
        this.load.image(
            GeneralAssets.baseBackgroundDay,
            "assets/bg/base-bg.png"
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
            .image(0, 0, GeneralAssets.baseBackgroundDay)
            .setOrigin(0, 0);

        const pane = this.add.image(
            img.width / 2,
            img.height / 2,
            UiAssets.briefingPane
        );

        const portrait = this.add.image(
            pane.x - pane.width / 2 + PADDING + ELPADDING,
            pane.y - pane.width / 2 + (PADDING * 3) - ELPADDING / 2,
            UiAssets.portraitPane
        ).setOrigin(0, 0);

        const paneX = PADDING + pane.x - pane.width / 2;
        const paneY = PADDING + pane.y - pane.height / 2;
        const paneWidth = pane.width - PADDING * 2 - PADDING / 2;

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

        const dailyEvent = this.global.currentDay.dailyEvent;

        const character = dailyEvent.character || "kiran";
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

        const dialogue = this.add.text(
            paneX + portrait.width + PADDING - ELPADDING,
            title.y + title.height + ELPADDING,
            characterText + ": ”" + dailyEvent?.morningMessage + "”",
            {
                ...baseTextOptions,
                fontSize: "14pt",
                wordWrap: {
                    width: paneWidth - (portrait.width + ELPADDING + 4),
                },
            }
        );

        let sectionStartHeight = dialogue.y + dialogue.height + ELPADDING;
        if ((portrait.y + portrait.height + ELPADDING) > sectionStartHeight) {
            sectionStartHeight = portrait.y + portrait.height + ELPADDING;
        }
        const sectionTitle = this.add
            .text(
                paneX + paneWidth / 2,
                sectionStartHeight,
                `Supplies`,
                {
                    ...baseTextOptions,
                }
            )
            .setOrigin(0.5, 0);

        let prevHeight = sectionTitle.height + ELPADDING;
        Object.keys(this.global.resources).forEach((k: keyof Resources) => {
            prevHeight +=
                this.generateRow(
                    paneX,
                    sectionTitle.y + prevHeight,
                    paneWidth / 3,
                    k
                ).height + ELPADDING;
        });

        new Button(this, {
            x: paneX + paneWidth / 2,
            y: sectionTitle.y + prevHeight,
            text: "Start day",
            onClick: () => {
                this.fadeToScene(OverworldScene.KEY, {});
            },
        }).setOrigin(0.5, 0);

        if (this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.stop(StatusUiScene.KEY);
        }
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

        let storageCountText = "Storage";
        if (resource) {
            storageCountText = String(this.global.resources[resource]);
        }

        // TODO align numbers / signs
        text = this.add.text(
            divider.x + divider.width,
            divider.y,
            storageCountText,
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
        const stat = this.global.baseStatus;

        // TODO align numbers / signs
        let deltaCountText = "Used/Gained Overnight";
        if (resource) {
            const count = stat.dailyReplenish[resource];
            deltaCountText = `${count > 0 ? "+" : "-"} ${Math.abs(count)}`;
        }

        text = this.add.text(
            divider.x + divider.width,
            divider.y,
            deltaCountText,
            textConfig
        );
        text.x += sectionWidth - text.width - ELPADDING;

        return text;
    }

    private getDisplayText() {
        const ret: string[] = [];

        const dailyEvent = this.global.currentDay.dailyEvent;

        if (dailyEvent?.morningMessage) {
            ret.push(dailyEvent.morningMessage + "\n");
        }

        const currentResources = this.global.resources;
        const startingResources = currentResources;
        const stat = this.global.baseStatus;

        ret.push(
            ...Object.entries(startingResources).map(
                (kv: [keyof Resources, number]) => {
                    const key = kv[0];
                    const message = `${key}: ${String(kv[1])} (+${stat.dailyReplenish[key]
                        }) / ${stat.maxStorage[key]}`;

                    return message;
                }
            )
        );

        return ret;
    }
}
