/* DEBUG ONLY - CHANGE VALUES HERE TO TEST DIFFERENT PARTS OF THE SYSTEM EASILY */

import { CellBiome } from "./objects/WorldMap/shared";
import { DayStartScene } from "./scenes/DayStartScene";
import { ExploreAreaScene } from "./scenes/ExploreAreaScene";
import { LogScene } from "./scenes/LogScene";
import { OverworldScene } from "./scenes/OverworldScene";

interface DebugConfig {
    sceneKey?: string;
    data?: object;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function debugGenerateText() {
    const text = [];

    // generate a bunch of lines
    for (let i = 0; i < 10; i++) {
        text.push(
            `(${i}) Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, maiores!`
        );
    }

    return text;
}

export const debugConfig: DebugConfig = {
    sceneKey: DayStartScene.KEY,
    data: {
        text: [
            ["page 1 line 1", ...debugGenerateText()],
            ["page 2 line 1", ...debugGenerateText()],
            ["page 3 line 1", ...debugGenerateText()],
        ],
        onComplete: () => console.log("complete"),
    },
};
