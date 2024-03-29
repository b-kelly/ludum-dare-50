import { baseTextOptions, SfxAssets, UiAssets } from "../shared";
import { Button } from "./Button";

type PagedText = string[][];

export class TextBox extends Phaser.GameObjects.Container {
    private currentPage = 0;
    private pages: PagedText;
    private prevPageBtn: Phaser.GameObjects.Sprite;
    private nextPageBtn: Phaser.GameObjects.Sprite;
    private proceedBtn: Button;
    private text: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        config: {
            x: number;
            y: number;
            backgroundAsset: Phaser.GameObjects.GameObject &
                Phaser.GameObjects.Components.Origin &
                Phaser.GameObjects.Components.GetBounds;
            pages: PagedText;
            padding: number;
            buttonAlign?: "right" | "left" | "center";
            buttonText?: string;
            pageStyles?: Phaser.Types.GameObjects.Text.TextStyle;
        }
    ) {
        super(scene, config.x, config.y);
        this.pages = config.pages;

        // background
        const img = config.backgroundAsset.setOrigin(0, 0);
        this.add(img);

        const { width, height } = img.getBounds();

        // back button
        this.prevPageBtn = this.scene.add
            .sprite(config.padding, height - config.padding, UiAssets.arrowLeft)
            .setOrigin(0, 1);
        this.add(this.prevPageBtn);

        this.prevPageBtn
            .setInteractive()
            .on("pointerup", () => {
                this.goToPage(this.currentPage - 1);
            })
            .on("pointerdown", () =>
                this.scene.sound.play(
                    SfxAssets.click.key,
                    SfxAssets.click.config
                )
            );

        // next button
        this.nextPageBtn = this.scene.add
            .sprite(
                width - config.padding,
                height - config.padding,
                UiAssets.arrowRight
            )
            .setOrigin(1, 1);
        this.add(this.nextPageBtn);

        this.nextPageBtn
            .setInteractive()
            .on("pointerup", () => {
                this.goToPage(this.currentPage + 1);
            })
            .on("pointerdown", () =>
                this.scene.sound.play(
                    SfxAssets.click.key,
                    SfxAssets.click.config
                )
            );

        let buttonX: number;
        let origin: [number, number];

        const buttonAlign = config.buttonAlign || "right";

        if (buttonAlign === "right") {
            buttonX = width - config.padding;
            origin = [1, 1];
        } else if (buttonAlign === "left") {
            buttonX = config.padding;
            origin = [0, 1];
        } else {
            buttonX = width / 2;
            origin = [0.5, 1];
        }

        this.text = this.scene.add.text(config.padding, config.padding, "", {
            ...baseTextOptions,
            ...(config.pageStyles || {}),
            wordWrap: {
                width: width - config.padding * 2,
            },
        });
        this.add(this.text);

        // proceed button
        this.proceedBtn = new Button(this.scene, {
            x: buttonX,
            y: height - config.padding,
            onClick: () => {
                this.emit("proceedclick");
            },
            text: config.buttonText || "Next",
        }).setOrigin(...origin);

        this.add(this.proceedBtn);

        this.scene.add.existing(this);

        this.goToPage(this.currentPage);
    }

    setPages(pages: PagedText) {
        this.pages = pages;
        this.goToPage(0);

        return this;
    }

    private goToPage(page: number) {
        const maxPage = this.pages.length - 1;

        // restrict page between 0 and number of pages
        this.currentPage = Math.min(Math.max(0, page), maxPage);

        this.prevPageBtn.setVisible(page > 0);
        this.nextPageBtn.setVisible(page < maxPage);
        this.proceedBtn.setVisible(page === maxPage);

        this.text.text = this.pages[this.currentPage]?.join("\n");
    }
}
