import { load } from "webfontloader";

export class WebFontFile extends Phaser.Loader.File {
    private fontName: string;

    constructor(loader: Phaser.Loader.LoaderPlugin, fontName: string) {
        super(loader, {
            type: "webfont",
            key: fontName,
        });

        this.fontName = fontName;
    }

    load() {
        const config: WebFont.Config = {
            fontactive: () => {
                this.signalFinishedLoading();
            },
            fontinactive: () => {
                this.signalFinishedLoading();
            },
            google: {
                families: [this.fontName],
            },
        };

        load(config);
    }

    private signalFinishedLoading() {
        this.loader.nextFile(this, true);
    }
}
