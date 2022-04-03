import { AreaResource } from "../objects/AreaMap/AreaResource";
import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets, TILE_WIDTH } from "../shared";

export const STATUS_UI_HEIGHT = TILE_WIDTH;

class Indicator {
    private type: keyof Resources;
    private scene: CustomScene;
    private haulText: Phaser.GameObjects.Text;
    private stashText: Phaser.GameObjects.Text;

    constructor(
        scene: CustomScene,
        x: number,
        y: number,
        type: keyof Resources
    ) {
        this.type = type;
        this.scene = scene;

        const icon = scene.add
            .sprite(
                x,
                y,
                GeneralAssets.resources,
                AreaResource.getGenericResourceSpriteFrame(type)
            )
            .setOrigin(0, 0);
        this.stashText = scene.add
            .text(x + icon.width, y + icon.height / 2, "999", baseTextOptions)
            .setOrigin(0, 0.5);
        this.haulText = scene.add
            .text(
                x + icon.width + this.stashText.width,
                y + icon.height / 2,
                "999",
                baseTextOptions
            )
            .setOrigin(0, 0.5);
        scene.add.group([icon, this.haulText], {});

        this.updateText();

        // TODO Show potential/realized losses/gains when applicable?
    }

    update() {
        this.updateText();
    }

    private updateText() {
        const haulCount = this.scene.global.currentDay.haul[this.type];
        this.haulText.text = `(${haulCount > 0 ? "+" : ""}${haulCount})`;

        const stashText = this.scene.global.resources[this.type];
        this.stashText.text = `${stashText}`;
    }
}

export class StatusUiScene extends CustomScene {
    static readonly KEY = "StatusUiScene";

    private text: Record<keyof Resources, Indicator>;

    constructor() {
        super({ key: StatusUiScene.KEY });
    }

    preload() {
        this.load.spritesheet(
            GeneralAssets.resources,
            "assets/resource-spritesheet.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );
    }

    create() {
        this.add
            .rectangle(0, 0, this.bounds.width, STATUS_UI_HEIGHT, 0x0000ff)
            .setOrigin(0, 0);

        this.text = {
            fuel: null,
            food: null,
            filters: null,
            parts: null,
            water: null,
        };

        Object.keys(this.text).forEach((k: keyof Resources, i) => {
            this.text[k] = new Indicator(this, i * 200, 0, k);
        });

        this.registry.events.on("changedata", () => {
            if (!this.scene.isActive(StatusUiScene.KEY)) {
                return;
            }

            Object.values(this.text).forEach((t) => t.update());
        });

        this.events.on("shutdown", () => {
            this.registry.events.off("changedata");
        });
    }
}
