import { GameScene } from "./scenes/GameScene";

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Sample",

    type: Phaser.AUTO,

    pixelArt: true,

    scale: {
        width: 512,
        height: 512,
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
    scene: [GameScene],
};
