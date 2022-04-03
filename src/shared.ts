export const baseTextOptions: Phaser.Types.GameObjects.Text.TextStyle = {
    fontSize: "20pt",
    // TODO
};

export const GeneralAssets = {
    narration: "narration",
    startBackground: "startBackground",
    logBackground: "logBackground",
    baseBackgroundDay: "baseBackgroundDay",
    baseBackgroundNight: "baseBackgroundNight",
    worldPlayer: "worldPlayer",
} as const;

// tiles are 64x64 px
export const TILE_WIDTH = 64;

export function DEBUG_isDebugBuild() {
    return process.env.NODE_ENV === "development";
}
