import { baseTextOptions, UiAssets } from "../shared";
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
            backgroundAssetKey: string;
            pages: PagedText;
            padding: number;
        }
    ) {
        super(scene, config.x, config.y);
        this.pages = config.pages;

        // background
        const img = this.scene.add
            .image(0, 0, config.backgroundAssetKey)
            .setOrigin(0, 0);
        this.add(img);

        // back button
        this.prevPageBtn = this.scene.add
            .sprite(0, img.height, UiAssets.arrowLeft)
            .setOrigin(0, 1);
        this.add(this.prevPageBtn);

        this.prevPageBtn.setInteractive().on("pointerup", () => {
            this.goToPage(this.currentPage - 1);
        });

        // next button
        this.nextPageBtn = this.scene.add
            .sprite(img.width, img.height, UiAssets.arrowRight)
            .setOrigin(1, 1);
        this.add(this.nextPageBtn);

        this.nextPageBtn.setInteractive().on("pointerup", () => {
            this.goToPage(this.currentPage + 1);
        });

        // TODO HARDCODED BUTTON DIMENSIONS
        // proceed button
        this.proceedBtn = new Button(this.scene, {
            x: img.width - 128,
            y: img.height - 56,
            onClick: () => {
                this.emit("proceedclick");
            },
            text: "Next",
        }).setVisible(false);

        this.add(this.proceedBtn);

        this.text = this.scene.add.text(config.padding, config.padding, "", {
            ...baseTextOptions,
            wordWrap: {
                width: img.width - config.padding * 2,
            },
        });
        this.add(this.text);

        this.scene.add.existing(this);

        this.goToPage(this.currentPage);
    }

    goToPage(page: number) {
        const maxPage = this.pages.length - 1;

        // restrict page between 0 and number of pages
        this.currentPage = Math.min(Math.max(0, page), maxPage);

        this.prevPageBtn.setVisible(page > 0);
        this.nextPageBtn.setVisible(page < maxPage);
        this.proceedBtn.setVisible(page === maxPage);

        this.text.text = this.pages[this.currentPage].join("\n");
    }
}
