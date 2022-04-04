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

const PADDING = 16;

class Indicator extends Phaser.GameObjects.Container {
    private resourceType: keyof Resources | "playerHp";
    private iconWidth = 64;
    private iconHeight = 64;
    private resourceText: Phaser.GameObjects.Text;
    private customScene: CustomScene;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    get height() {
        return this.iconHeight + this.resourceText.height + PADDING;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    get width() {
        return this.iconWidth + this.resourceText.width + PADDING;
    }

    constructor(
        scene: CustomScene,
        x: number,
        y: number,
        type: keyof Resources | "playerHp",
        hideIcon: boolean
    ) {
        super(scene, x, y);
        this.customScene = scene;

        this.resourceType = type;
        this.scene = scene;

        if (!hideIcon) {
            const resourceIcon = scene.make
                .sprite({
                    x: PADDING,
                    y: PADDING,
                    key: GeneralAssets.resources,
                    frame: AreaResource.getGenericResourceSpriteFrame(
                        type as keyof Resources
                    ),
                })
                .setOrigin(0, 0)
                .setScale(0.5);
            this.add(resourceIcon);
            this.iconWidth = resourceIcon.width;
            this.iconHeight = resourceIcon.height;
        }

        this.resourceText = scene.make
            .text({
                x: this.iconWidth,
                y: this.iconHeight / 2,
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

    setOrigin(x: number, y: number) {
        const totalWidth = this.height;
        const totalHeight = this.width;

        const newX = this.x - totalWidth * x;
        const newY = this.y - totalHeight * y;
        this.setPosition(newX, newY);

        return this;
    }

    private updateText() {
        if (this.resourceType === "playerHp") {
            this.resourceText.text = `HP\n${this.customScene.global.playerHp}`;
        } else {
            const resourceName = this.resourceType.replace(/^./, (c) =>
                c.toUpperCase()
            );
            const haulCount =
                this.customScene.global.currentDay.haul[this.resourceType];
            const stashText =
                this.customScene.global.resources[this.resourceType];
            this.resourceText.text = `${resourceName}\n${stashText} (${
                haulCount > 0 ? "+" : ""
            }${haulCount})`;
        }
    }
}

export class StatusUiScene extends CustomScene {
    static readonly KEY = "StatusUiScene";

    private text: Record<keyof Resources | "playerHp", Indicator>;

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
            filters: null,
            food: null,
            fuel: null,
            panels: null,
            parts: null,
            water: null,
            playerHp: null,
        };

        Object.keys(this.text)
            .sort()
            .filter((k) => k !== "fuel" && k !== "playerHp") // fuel/hp has their own indicators
            .forEach((k: keyof Resources, i) => {
                // TODO hardcoded width
                this.text[k] = new Indicator(this, i * 150, 0, k, false);
            });

        this.text["fuel"] = new Indicator(
            this,
            this.bounds.width,
            0,
            "fuel",
            true
        ).setOrigin(1, 0);

        this.text["playerHp"] = new Indicator(
            this,
            this.bounds.width - this.text["fuel"].width,
            0,
            "playerHp",
            true
        ).setOrigin(1, 0);

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
