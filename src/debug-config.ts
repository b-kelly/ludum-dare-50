/* DEBUG ONLY - CHANGE VALUES HERE TO TEST DIFFERENT PARTS OF THE SYSTEM EASILY */

import { BaseScene } from "./scenes/BaseScene";

interface DebugConfig {
    sceneKey: string;
    data: object;
}

export const debugConfig: DebugConfig = {
    sceneKey: BaseScene.KEY,
    data: {},
};
