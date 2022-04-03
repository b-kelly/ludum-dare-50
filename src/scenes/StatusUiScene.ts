import { CustomScene } from "../objects/CustomScene";
import { baseTextOptions, GeneralAssets } from "../shared";
import { Button } from "../UI/Button";

export class StatusUiScene extends CustomScene {
    static readonly KEY = "StatusUiScene";

    constructor() {
        super({ key: StatusUiScene.KEY });
    }

    preload() {}

    create() {}

    update(/*time: number*/) {
        /* TODO update all the things */
    }
}
