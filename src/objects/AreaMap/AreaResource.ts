import { GeneralAssets, TILE_WIDTH } from "../../shared";
import { Resources } from "../GlobalDataStore";
import { CellBiome } from "../WorldMap/shared";

export class AreaResource extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body;

    private resource: keyof Resources;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        resource: keyof Resources,
        biome: CellBiome
    ) {
        super(
            scene,
            x + TILE_WIDTH / 2,
            y + TILE_WIDTH / 2,
            GeneralAssets.resources,
            AreaResource.getResourceSpriteFrame(resource, biome)
        );

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    /*
     * Legend: [G]eneric, [B]iome
     * Sheet is laid out like
     * GGGG - fuel/water @2ea
     * BBBG - food
     * BBBG - filters
     * BBBG - parts
     */
    private static getResourceSpriteFrame(
        resource: keyof Resources,
        biome: CellBiome
    ) {
        if (resource === "fuel") {
            return Phaser.Math.RND.integerInRange(0, 1);
        } else if (resource === "water") {
            return Phaser.Math.RND.integerInRange(2, 3);
        }

        const layout = {
            ["forest" as CellBiome]: 0,
            ["wetlands" as CellBiome]: 1,
            ["desert" as CellBiome]: 2,
            generic: 3,
        };
        let row = 0;

        switch (resource) {
            case "food":
                row = 1;
                break;
            case "filters":
                row = 2;
                break;
            case "parts":
                row = 3;
        }

        const startIndex = row * 4;

        return Phaser.Math.RND.pick([
            startIndex + layout[biome],
            startIndex + layout.generic,
        ]);
    }
}
