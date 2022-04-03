import "./styles.css";
import * as Phaser from "phaser";
import { DayStartScene } from "./scenes/DayStartScene";
import { LogScene } from "./scenes/LogScene";
import { OverworldScene } from "./scenes/OverworldScene";
import { StartMenuScene } from "./scenes/StartMenuScene";
import { ExploreAreaScene } from "./scenes/ExploreAreaScene";
import { DEBUG_isDebugBuild } from "./shared";
import { StatusUiScene } from "./scenes/StatusUiScene";
import { DayReviewScene } from "./scenes/DayReviewScene";
import { GameOverScene } from "./scenes/GameOverScene";

const USE_TEST_SEED = false;
const TEST_SEED = ["ld50"];

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
            debug: false, //DEBUG_isDebugBuild(),
            gravity: { x: 0, y: 0 },
        },
    },

    seed: DEBUG_isDebugBuild() && USE_TEST_SEED ? TEST_SEED : undefined,

    parent: "js-game-container",
    autoFocus: true,
    scene: [
        StartMenuScene,
        LogScene,
        DayStartScene,
        OverworldScene,
        ExploreAreaScene,
        DayReviewScene,
        StatusUiScene,
        GameOverScene,
    ],
});

// fire up an alert when an exception happens (so at the very least users aren't scratching their heads)
window.onerror = function (message: string) {
    alert(
        "There was an unavoidable exception :(\nPlease report this to the devs:\n\n" +
            message
    );
};

// set the game object on window.instance for easy debugging
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
global.instance = game;

if (DEBUG_isDebugBuild()) {
    document
        .querySelectorAll<HTMLElement>(".js-hide-debug")
        .forEach((el) => (el.style.display = "block"));
}
