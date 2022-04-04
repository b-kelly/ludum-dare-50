import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets, UiAssets } from "../shared";
import { Button } from "../UI/Button";
import { OverworldScene } from "./OverworldScene";
import { StatusUiScene } from "./StatusUiScene";

const PADDING = 48;
const ELPADDING = 8;

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

        const paneX = PADDING + pane.x - pane.width / 2;
        const paneY = PADDING + pane.y - pane.height / 2;
        const paneWidth = pane.width - PADDING * 2 - PADDING / 2;

        const title = this.add
            .text(
                paneX + paneWidth / 2,
                paneY,
                `13th Mission to Kepler 22B - Day ${
                    30 + this.global.campaignStats.dayCount
                }`,
                {
                    ...baseTextOptions,
                }
            )
            .setOrigin(0.5, 0);

        const dailyEvent = this.global.currentDay.dailyEvent;

        const dialogue = this.add.text(
            paneX,
            title.y + title.height + ELPADDING,
            dailyEvent?.morningMessage,
            {
                ...baseTextOptions,
                fontSize: "14pt",
                wordWrap: {
                    width: paneWidth,
                },
            }
        );

        const sectionTitle = this.add
            .text(
                paneX + paneWidth / 2,
                dialogue.y + dialogue.height + ELPADDING,
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
                    const message = `${key}: ${String(kv[1])} (+${
                        stat.dailyReplenish[key]
                    }) / ${stat.maxStorage[key]}`;

                    return message;
                }
            )
        );

        return ret;
    }
}
