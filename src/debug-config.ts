/* DEBUG ONLY - CHANGE VALUES HERE TO TEST DIFFERENT PARTS OF THE SYSTEM EASILY */

import { BaseScene } from "./scenes/BaseScene";
import { ExploreScene } from "./scenes/ExploreScene";
import { MapScene } from "./scenes/MapScene";

interface DebugConfig {
    sceneKey?: string;
    data?: object;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function debugGenerateText() {
    const text = [];

    // generate a bunch of lines
    for (let i = 0; i < 25; i++) {
        text.push(
            `(${i}) Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, maiores!`
        );
    }

    return text;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onComplete(this: Phaser.Scene) {
    this.scene.start(BaseScene.KEY, {});
}

export const debugConfig: DebugConfig = {
    sceneKey: BaseScene.KEY,
    data: {},
};
