export const baseTextOptions: Phaser.Types.GameObjects.Text.TextStyle = {
    fontSize: "20pt",
    fontFamily: '"Exo 2", sans-serif',
    fontStyle: "small-caps",
};

export const GeneralAssets = {
    narration: "narration",
    events: "events",
    startBackground: "startBackground",
    logBackground: "logBackground",
    baseBackgroundDay: "baseBackgroundDay",
    baseBackgroundNight: "baseBackgroundNight",
    colonyEventBackground: "colonyEventBackground",
    worldPlayer: "worldPlayer",
    areaPlayer: "areaPlayer",
    areaEnemies: "areaEnemies",
    resources: "resources",
    characterPortraits: "characterPortraits",
    characterInfo: "characterInfo",
} as const;

export const UiAssets = {
    buttonLg: "buttonLg",
    buttonLgHover: "buttonLgHover",
    buttonLgPress: "buttonLgPress",
    buttonSm: "buttonSm",
    topbar: "topbar",
    arrowLeft: "arrowLeft",
    arrowRight: "arrowRight",
    tutorialPane: "tutorialPane",
    briefingPane: "briefingPane",
    portraitPane: "portraitPane",
    // kevIcon: "kev",
    // storageIcon: "storage"
} as const;

export const SfxAssets = {
    bgDesert: "bgDesert",
    bgForest: "bgForest",
    bgIntroOverworld: {
        key: "bgIntroOverworld",
        marker: {
            name: "overworldOnly",
            start: 36,
            config: {
                loop: true,
            },
        },
    },
    bgWetland: "bgWetland",
    click: {
        key: "click",
        config: {
            volume: 1,
        },
    },
    enemyHit: "enemyHit",
    engine: "engine",
    grabResource: "grabResource",
    mapEvent: "mapEvent",
    mapScan: "mapScan",
} as const;

// tiles are 64x64 px
export const TILE_WIDTH = 64;

export function DEBUG_isDebugBuild() {
    return process.env.NODE_ENV === "development";
}
