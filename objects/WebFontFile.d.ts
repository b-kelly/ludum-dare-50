export declare class WebFontFile extends Phaser.Loader.File {
    private fontName;
    constructor(loader: Phaser.Loader.LoaderPlugin, fontName: string);
    load(): void;
    private signalFinishedLoading;
}
