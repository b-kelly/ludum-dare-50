import { baseTextOptions, SfxAssets, UiAssets } from "../shared";

export class Button extends Phaser.GameObjects.Container {
    private isDisabled: boolean;
    private buttonImg: Phaser.GameObjects.Sprite;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    get height() {
        return this.buttonImg.height;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    get width() {
        return this.buttonImg.width;
    }

    constructor(
        scene: Phaser.Scene,
        options: {
            x: number;
            y: number;
            text: string;
            onClick: () => void;
            size?: "large" | "small";
            disabled?: boolean;
        }
    ) {
        super(scene, options.x, options.y);

        scene.add.existing(this);

        // large is the default size
        const asset =
            options.size === "small" ? UiAssets.buttonSm : UiAssets.buttonLg;
        this.buttonImg = this.scene.add.sprite(0, 0, asset).setOrigin(0, 0);

        this.setInteractive(
            new Phaser.Geom.Rectangle(
                0,
                0,
                this.buttonImg.width,
                this.buttonImg.height
            ),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            Phaser.Geom.Rectangle.Contains
        )
            .on("pointerup", options.onClick)
            .on("pointerdown", () =>
                this.scene.sound.play(
                    SfxAssets.click.key,
                    SfxAssets.click.config
                )
            )
            .on("pointerover", () => this.hover(true))
            .on("pointerout", () => this.hover(false));

        this.setDisabled(options.disabled);

        // take the width of the shadow into consideration when visually centering
        const shadowWidth = 4;
        const text = this.scene.make
            .text({
                x: this.buttonImg.width / 2 - shadowWidth,
                y: this.buttonImg.height / 2 - shadowWidth,
                text: options.text,
                style: {
                    ...baseTextOptions,
                    align: "center",
                },
            })
            .setOrigin(0.5);

        this.add(this.buttonImg);
        this.add(text);
    }

    setOrigin(x: number, y: number) {
        const newX = this.x - this.buttonImg.width * x;
        const newY = this.y - this.buttonImg.height * y;
        this.setPosition(newX, newY);

        return this;
    }

    setOnClick(callback: () => void) {
        this.off("pointerup").on("pointerup", callback);
    }

    setDisabled(isDisabled: boolean) {
        this.isDisabled = isDisabled;

        // TODO potentially change sprite frame
        if (this.isDisabled) {
            this.setAlpha(0.5);
        } else {
            this.setAlpha(1);
        }
    }

    private hover(entered: boolean) {
        if (this.isDisabled) {
            return;
        }

        if (entered) {
            // TODO change sprite frame
        } else {
            // TODO change sprite frame
        }
    }
}
