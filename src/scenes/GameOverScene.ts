import { CustomScene } from "../objects/CustomScene";
import { GameOverType } from "../objects/GlobalDataStore";
import { GeneralAssets } from "../shared";
import { Button } from "../UI/Button";
import { TextBox } from "../UI/TextBox";

const PADDING = 32;
export class GameOverScene extends CustomScene {
    static readonly KEY = "GameOverScene";

    private type: GameOverType;

    constructor() {
        super({ key: GameOverScene.KEY });
    }

    init(data: { type: GameOverType }) {
        super.init(null);
        this.type = data.type;
    }

    preload() {
        this.load.image(
            GeneralAssets.colonyEventBackground,
            "assets/bg/colony-event.png"
        );
    }

    create() {
        if (this.type !== "colonies") {
            this.showLog();
            return;
        }

        const colonyPrompt = new TextBox(this, {
            x: 0,
            y: 0,
            backgroundAsset: this.add.image(
                0,
                0,
                GeneralAssets.colonyEventBackground
            ),
            pages: [this.getText()],
            padding: PADDING,
            buttonText: "Ignore",
        }).on("proceedclick", () => {
            colonyPrompt.setVisible(false);
            this.showLog(false);
        });

        new Button(this, {
            x: PADDING,
            y: this.bounds.height - PADDING,
            text: "Answer the voice",
            onClick: () => {
                colonyPrompt.setVisible(false);
                this.showLog(true);
            },
        }).setOrigin(0, 1);
    }

    private showLog(answered = false) {
        let text = this.getText(answered);

        if (this.type === "resource") {
            const emptyResource =
                Object.entries(this.global.resources).find(
                    (kv) => +kv[1] <= 0
                )?.[0] || "ERROR";

            text = text.map((t) => t.replace("{{resource}}", emptyResource));
        }

        new TextBox(this, {
            x: 0,
            y: 0,
            backgroundAsset: this.add.image(
                0,
                0,
                GeneralAssets.colonyEventBackground
            ),
            pages: [text, ["THANK YOU SO MUCH FOR PLAYING OUR GAME!"], ["CLICK TO PLAY AGAIN!"]],
            padding: PADDING,
            buttonText: "Start again?",
        }).on("proceedclick", () => {
            this.fadeToScene("StartMenuScene");
        });
    }

    private getText(answered: boolean = undefined) {
        const json = this.cache.json.get(GeneralAssets.narration) as {
            gameover_tiles: string[];
            gameover_resources: string[];
            gameover_colonies_prompt: string[];
            gameover_colonies_answered: string[];
            gameover_colonies_ignored: string[];
        };

        switch (this.type) {
            case "colonies":
                if (typeof answered === "undefined") {
                    return json.gameover_colonies_prompt;
                }

                return answered
                    ? json.gameover_colonies_answered
                    : json.gameover_colonies_ignored;
            case "tiles":
                return json.gameover_tiles;
            case "resource":
            default:
                return json.gameover_resources;
        }
    }
}
