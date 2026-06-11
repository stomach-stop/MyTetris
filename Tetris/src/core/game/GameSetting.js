import { Random } from "../common/Random.js";
import { SevenBagStrategy } from "../../polyomino/strategy/SevenBagStrategy.js";
import { TetrominoFactory } from "../../polyomino/tetromino/TetrominoFactory.js";

export class GameSetting {
    constructor() {
        //生成方法の設定
        this.seed = 65535;
        this.rand = new Random(this.seed);
        this.strategy = new SevenBagStrategy(this.rand);
        this.factory = new TetrominoFactory(this.strategy);

        //難易度の設定
        this.level = 1;
        this.canLevelUp = true;
    }
}