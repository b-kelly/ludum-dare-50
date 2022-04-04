export declare const baseTextOptions: Phaser.Types.GameObjects.Text.TextStyle;
export declare const GeneralAssets: {
    readonly narration: "narration";
    readonly events: "events";
    readonly startBackground: "startBackground";
    readonly logBackground: "logBackground";
    readonly baseBackgroundDay: "baseBackgroundDay";
    readonly baseBackgroundNight: "baseBackgroundNight";
    readonly worldPlayer: "worldPlayer";
    readonly areaPlayer: "areaPlayer";
    readonly resources: "resources";
};
export declare const UiAssets: {
    readonly buttonLg: "buttonLg";
    readonly buttonSm: "buttonSm";
    readonly topbar: "topbar";
    readonly arrowLeft: "arrowLeft";
    readonly arrowRight: "arrowRight";
    readonly tutorialPane: "tutorialPane";
    readonly briefingPane: "briefingPane";
};
export declare const SfxAssets: {
    readonly bgDesert: "bgDesert";
    readonly bgForest: "bgForest";
    readonly bgIntroOverworld: {
        readonly key: "bgIntroOverworld";
        readonly marker: {
            readonly name: "overworldOnly";
            readonly start: 36;
            readonly config: {
                readonly loop: true;
            };
        };
    };
    readonly bgWetland: "bgWetland";
    readonly click: {
        readonly key: "click";
        readonly config: {
            readonly volume: 1;
        };
    };
    readonly enemyHit: "enemyHit";
    readonly engine: "engine";
    readonly grabResource: "grabResource";
    readonly mapEvent: "mapEvent";
};
export declare const TILE_WIDTH = 64;
export declare function DEBUG_isDebugBuild(): boolean;
