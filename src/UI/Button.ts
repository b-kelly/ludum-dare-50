import { baseTextOptions } from "../shared";

export type ButtonType = "button" | "primary"; //TODO

export class Button extends Phaser.GameObjects.Text {
    private isDisabled: boolean;

    constructor(
        scene: Phaser.Scene,
        options: {
            x: number;
            y: number;
            text: string;
            onClick: () => void;
            width?: number;
            height?: number;
            type?: ButtonType;
            disabled?: boolean;
        }
    ) {
        super(scene, options.x, options.y, options.text, {
            ...baseTextOptions,
            color: "#ffffff", //TODO
            backgroundColor: "#0000ff", // TODO
        });

        this.isDisabled = options.disabled || false;

        // TODO abstract out colors, base them on the button type
        this.setInteractive()
            .on("pointerup", options.onClick)
            .on("pointerover", () => this.hover(true))
            .on("pointerout", () => this.hover(false));
        scene.add.existing(this);
    }

    setOnClick(callback: () => void) {
        this.off("pointerup").on("pointerup", callback);
    }

    setDisabled(isDisabled: boolean) {
        this.isDisabled = isDisabled;

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
            this.setStyle({ backgroundColor: "#00ff00", color: "#000000" });
        } else {
            this.setStyle({ backgroundColor: "#0000ff", color: "#ffffff" });
        }
    }
}
