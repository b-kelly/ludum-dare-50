import { AreaResource } from "../objects/AreaMap/AreaResource";
import { CustomScene } from "../objects/CustomScene";
import { Resources } from "../objects/GlobalDataStore";
import {
    baseTextOptions,
    GeneralAssets,
    TILE_WIDTH,
    UiAssets,
} from "../shared";

export const STATUS_UI_HEIGHT = 80;

class Indicator extends Phaser.GameObjects.Container {
    private resourceType: keyof Resources;
    private resourceText: Phaser.GameObjects.Text;
    private customScene: CustomScene;

    constructor(
        scene: CustomScene,
        x: number,
        y: number,
        type: keyof Resources
    ) {
        super(scene, x, y);
        this.customScene = scene;

        this.resourceType = type;
        this.scene = scene;

        const icon = scene.make
            .sprite({
                x: x + 16,
                y: y + 16,
                key: GeneralAssets.resources,
                frame: AreaResource.getGenericResourceSpriteFrame(type),
            })
            .setOrigin(0, 0)
            .setScale(0.5);
        this.add(icon);

        this.resourceText = scene.make
            .text({
                x: x + icon.width,
                y: y + icon.height / 2,
                text: "",
                style: {
                    ...baseTextOptions,
                    fontSize: "15pt",
                },
            })
            .setOrigin(0, 0.5);
        this.add(this.resourceText);

        this.updateText();

        scene.add.existing(this);

        // TODO Show potential/realized losses/gains when applicable?
    }

    update() {
        this.updateText();
    }

    private updateText() {
        const resourceName = this.resourceType.replace(/^./, (c) =>
            c.toUpperCase()
        );
        const haulCount =
            this.customScene.global.currentDay.haul[this.resourceType];
        const stashText = this.customScene.global.resources[this.resourceType];
        this.resourceText.text = `${resourceName}\n${stashText} (${
            haulCount > 0 ? "+" : ""
        }${haulCount})`;
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
            "assets/sprites/resources-tileset.png",
            {
                frameWidth: TILE_WIDTH,
                frameHeight: TILE_WIDTH,
            }
        );
    }

    create() {
        this.input.enabled = false;

        // TODO HACK crop the image for real instead of hiding the part off the edge of the screen
        this.add.image(0, 0 - 40, UiAssets.topbar).setOrigin(0, 0);

        this.text = {
            fuel: null,
            food: null,
            filters: null,
            parts: null,
            water: null,
        };

        Object.keys(this.text)
            .sort()
            .forEach((k: keyof Resources, i) => {
                this.text[k] = new Indicator(this, i * 75, 0, k);
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
