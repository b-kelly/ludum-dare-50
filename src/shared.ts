export const baseTextOptions: Phaser.Types.GameObjects.Text.TextStyle = {
    fontSize: "20pt",
    fontFamily: '"Exo 2", sans-serif',
    // TODO
};

export const GeneralAssets = {
    narration: "narration",
    events: "events",
    startBackground: "startBackground",
    logBackground: "logBackground",
    baseBackgroundDay: "baseBackgroundDay",
    baseBackgroundNight: "baseBackgroundNight",
    worldPlayer: "worldPlayer",
    areaPlayer: "areaPlayer",
    resources: "resources",
} as const;

// tiles are 64x64 px
export const TILE_WIDTH = 64;

export function DEBUG_isDebugBuild() {
    return process.env.NODE_ENV === "development";
}
