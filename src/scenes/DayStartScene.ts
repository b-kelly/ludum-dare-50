import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { GeneralAssets, UiAssets } from "../shared";
import { TextBox } from "../UI/TextBox";
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

        const textBox = new TextBox(this, {
            x: img.width * 0.125,
            y: img.height * 0.1,
            pages: [this.getDisplayText()],
            padding: 16,
            backgroundAsset: this.add.rectangle(
                0,
                0,
                img.width * 0.75,
                img.height * 0.8,
                0x0a2a33
            ),
            buttonAlign: "center",
            buttonText: "Explore",
        });

        textBox.on("proceedclick", () => {
            this.scene.start(OverworldScene.KEY, {});
        });

        if (this.scene.isActive(StatusUiScene.KEY)) {
            this.scene.stop(StatusUiScene.KEY);
        }
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
                (kv: [keyof Resources, number], i) => {
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
