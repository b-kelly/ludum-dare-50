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
        backgroundAssetKey: string;
        pages: PagedText;
        padding: number;
    });
    goToPage(page: number): void;
}
export {};
