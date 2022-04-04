declare type PagedText = string[][];
export declare class TextBox extends Phaser.GameObjects.Container {
    private currentPage;
    private pages;
    private prevPageBtn;
    private nextPageBtn;
    private proceedBtn;
    private text;
    constructor(scene: Phaser.Scene, config: {
        x: number;
        y: number;
        backgroundAsset: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Origin & Phaser.GameObjects.Components.GetBounds;
        pages: PagedText;
        padding: number;
        buttonAlign?: "right" | "left" | "center";
        buttonText?: string;
    });
    setPages(pages: PagedText): this;
    private goToPage;
}
export {};
