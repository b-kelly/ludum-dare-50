import { AreaResource } from "../objects/AreaMap/AreaResource";
import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import { baseTextOptions, GeneralAssets, TILE_WIDTH } from "../shared";

class Indicator {
    private type: keyof Resources;
    private scene: CustomScene;
    private text: Phaser.GameObjects.Text;

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
        this.text = scene.add
            .text(x + icon.width, y + icon.height / 2, "", baseTextOptions)
            .setOrigin(0, 0.5);
        scene.add.group([icon, this.text], {});

        this.updateText();

        this.scene.registry.events.on("changedata", () => this.updateText());
    }

    private updateText() {
        const resourceCount = this.scene.global.currentDay.haul[this.type];
        this.text.text = `${resourceCount}`;
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
            .rectangle(0, 0, this.bounds.width, 50, 0x0000ff)
            .setOrigin(0, 0);

        this.text = {
            fuel: null,
            food: null,
            filters: null,
            parts: null,
            water: null,
        };

        Object.keys(this.text).forEach((k: keyof Resources, i) => {
            this.text[k] = new Indicator(this, i * 150, 0, k);
        });
    }
}
