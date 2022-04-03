import { CustomScene } from "../objects/CustomScene";
import { GameOverType } from "../objects/GlobalDataStore";
export declare class GameOverScene extends CustomScene {
    static readonly KEY = "GameOverScene";
    private type;
    constructor();
    init(data: {
        type: GameOverType;
    }): void;
    preload(): void;
    create(): void;
}
