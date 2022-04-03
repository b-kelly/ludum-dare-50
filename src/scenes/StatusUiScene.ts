import { CustomScene } from "../objects/CustomScene";
import { baseTextOptions } from "../shared";

export class StatusUiScene extends CustomScene {
    static readonly KEY = "StatusUiScene";

    private fuelText: Phaser.GameObjects.Text;

    constructor() {
        super({ key: StatusUiScene.KEY });
    }

    preload() {
        // TODO
    }

    create() {
        this.add
            .rectangle(0, 0, this.bounds.width, 50, 0x0000ff)
            .setOrigin(0, 0);

        this.fuelText = this.add.text(
            0,
            0,
            this.getFuelText(),
            baseTextOptions
        );

        this.registry.events.on("changedata", () => this.updateHud());
    }

    update(/*time: number*/) {
        /* TODO update all the things */
    }

    private updateHud() {
        this.fuelText.text = this.getFuelText();
    }

    private getFuelText() {
        return `Fuel ${this.global.resources.fuel}`;
    }
}
