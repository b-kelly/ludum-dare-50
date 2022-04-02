import { baseTextOptions } from "../shared";

export type ButtonType = "button" | "primary"; //TODO

export class Button extends Phaser.GameObjects.Text {
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
        }
    ) {
        super(scene, options.x, options.y, options.text, {
            ...baseTextOptions,
            color: "#ffffff", //TODO
            backgroundColor: "#0000ff", // TODO
        });

        // TODO abstract out colors, base them on the button type
        this.setInteractive()
            .on("pointerup", options.onClick)
            .on("pointerover", () =>
                this.setStyle({ backgroundColor: "#00ff00", color: "#000000" })
            )
            .on("pointerout", () =>
                this.setStyle({ backgroundColor: "#0000ff", color: "#ffffff" })
            );
        scene.add.existing(this);
    }
}
