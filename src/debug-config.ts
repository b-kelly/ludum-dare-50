/* DEBUG ONLY - CHANGE VALUES HERE TO TEST DIFFERENT PARTS OF THE SYSTEM EASILY */

import { LogScene } from "./scenes/LogScene";

interface DebugConfig {
    sceneKey: string;
    data: object;
}

export const debugConfig: DebugConfig = {
    sceneKey: LogScene.KEY,
    data: {},
};
