/* DEBUG ONLY - CHANGE VALUES HERE TO TEST DIFFERENT PARTS OF THE SYSTEM EASILY */

import { CellBiome } from "./objects/WorldMap/shared";
import { DayStartScene } from "./scenes/DayStartScene";
import { ExploreAreaScene } from "./scenes/ExploreAreaScene";
import { LogScene } from "./scenes/LogScene";
import { OverworldScene } from "./scenes/OverworldScene";

interface DebugConfig {
    sceneKey?: string;
    data?: object;
    skipTutorial: boolean;
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
        biome: "desert",
    },
    skipTutorial: false,
};
