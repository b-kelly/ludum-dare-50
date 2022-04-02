import { BaseScene } from "./scenes/BaseScene";
import { LogScene } from "./scenes/LogScene";
import { MapScene } from "./scenes/MapScene";
import { StartMenuScene } from "./scenes/StartMenuScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Sample",

    type: Phaser.AUTO,

    pixelArt: true,

    scale: {
        width: 1024,
        height: 768,
        mode: Phaser.Scale.NONE,
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 100 },
        },
    },

    parent: "js-game-container",
    autoFocus: true,
    scene: [StartMenuScene, LogScene, BaseScene, MapScene],
};
