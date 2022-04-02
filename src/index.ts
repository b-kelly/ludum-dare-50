import "./styles.css";
import * as Phaser from "phaser";
import { gameConfig } from "./config";

export const game = new Phaser.Game(gameConfig);

// set the game object on window.instance for easy debugging
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
global.instance = game;
