import { CustomScene } from "../objects/CustomScene";
import { baseTextOptions } from "../shared";
import { Button } from "../UI/Button";

const BaseAssets = {
    background: "background",
} as const;

export class BaseScene extends CustomScene {
    static readonly KEY = "BaseScene";

    constructor() {
        super({ key: BaseScene.KEY });
    }

    init(data: object) {
        console.log(BaseScene.KEY, data, this.global.resources);
    }

    preload() {
        this.load.image(BaseAssets.background, "assets/base-bg.png");
    }

    create() {
        // add background
        this.add.image(0, 0, BaseAssets.background).setOrigin(0, 0);
        this.createResourcesDisplay();
        new Button(this, {
            x: 0,
            y: 0,
            text: "Next",
            onClick: () => {
                //TODO
            },
        });
    }

    private createResourcesDisplay() {
        const { width, height } = this.bounds;

        // resource box TODO HARDCODED COORDS - better way?
        this.add.rectangle(
            width * 0.5,
            height * 0.5,
            width * 0.5,
            height * 0.75,
            0x000000,
            0.5
        );

        const resources = this.global.resources;
        Object.entries(resources).forEach((kv, i) => {
            const textHeight = 50; // TODO HOW TO GET THIS
            this.add.text(
                width * 0.25,
                height * 0.125 + i * textHeight,
                `${kv[0]}: ${String(kv[1])}`,
                baseTextOptions
            );
        });
    }
}
