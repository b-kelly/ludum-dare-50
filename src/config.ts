import { StartMenuScene } from "./scenes/StartMenuScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Sample",

    type: Phaser.AUTO,

    pixelArt: true,

    scale: {
        width: 1024,
        height: 768,
        mode: Phaser.Scale.FIT,
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
    scene: [StartMenuScene],
};
