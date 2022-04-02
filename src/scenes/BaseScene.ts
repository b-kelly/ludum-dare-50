import { CustomScene } from "../objects/CustomScene";

export class BaseScene extends CustomScene {
    static readonly KEY = "BaseScene";

    constructor() {
        super({ key: BaseScene.KEY });
    }

    init(data: object) {
        console.log(BaseScene.KEY, data, this.global.resources);
    }

    preload() {
        // TODO
    }

    create() {
        //TODO
    }
}
