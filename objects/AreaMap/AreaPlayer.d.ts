export declare class AreaPlayer extends Phaser.GameObjects.Sprite {
    body: Phaser.Physics.Arcade.Body;
    private controls;
    private damagedAt;
    constructor(scene: Phaser.Scene, x: number, y: number);
    update(): void;
    damage(time: number): boolean;
}
