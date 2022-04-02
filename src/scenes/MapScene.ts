export class MapScene extends Phaser.Scene {
    static readonly KEY = "MapScene";

    constructor() {
        super({ key: MapScene.KEY });
    }

    init(data: object) {
        console.log(MapScene.KEY, data);
    }

    preload() {
        // TODO
    }

    create() {
        //TODO
    }
}
