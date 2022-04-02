import "./styles.css";
import * as Phaser from "phaser";
import { BaseScene } from "./scenes/BaseScene";
import { LogScene } from "./scenes/LogScene";
import { MapScene } from "./scenes/MapScene";
import { StartMenuScene } from "./scenes/StartMenuScene";
import { ExploreScene } from "./scenes/ExploreScene";
import { AreaMap } from "./objects/AreaMap";

export const game = new Phaser.Game({
    title: "Sample",

    type: Phaser.AUTO,

    pixelArt: false,

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
    scene: [StartMenuScene, LogScene, BaseScene, MapScene, ExploreScene],
});

// set the game object on window.instance for easy debugging
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
global.instance = game;
