import { CustomScene } from "../objects/CustomScene";
import { GameOverType } from "../objects/GlobalDataStore";
import { baseTextOptions } from "../shared";

export class GameOverScene extends CustomScene {
    static readonly KEY = "GameOverScene";

    private type: GameOverType;

    constructor() {
        super({ key: GameOverScene.KEY });
    }

    init(data: { type: GameOverType }) {
        this.type = data.type;
    }

    preload() {
        // TODO
    }

    create() {
        const stats = this.global.campaignStats;
        // TODO reuse LogScene?
        this.add.text(
            0,
            0,
            `Game Over (${this.type})
Days survived: ${stats.dayCount}
Events: ${stats.dailyProgress
                .map((d) => d.events.map((e) => e.shortDescriptor))
                .flat()
                .join("\n")}
        `,
            baseTextOptions
        );
    }
}
