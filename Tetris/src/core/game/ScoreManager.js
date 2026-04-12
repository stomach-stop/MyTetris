import { eventBus } from "../common/EventBus.js";

export class ScoreManager {
    constructor(){
        this._score = 0;
        this._level = 1;
        this._combo = -1; 
        this.maxLevel = 10;
        this._canLevelUp = true;
        this._totalLines = 0; //合計消去ライン数
        this._backToBack = false; //連続ボーナス
        this.linesPerLevel = 10; //レベルアップ間隔
        this._dropInterval = this.calcDropInterval(); //落下間隔

        //イベント購読
        eventBus.on("piece-locked", (data) => {
            this.onPieceLocked(data);
        });
        eventBus.on("soft-drop", () => {
            this._score += 1;
        });
        eventBus.on("hard-drop", ({dist}) => {
            this._score += dist * 2;
        });
    }

    onPieceLocked({ lines }) { //ミノ固定時の処理
        if (lines > 0 && lines < 4) this._backToBack = false; //B2B判定
        this._combo = (lines > 0) ? this._combo + 1 : -1; //コンボ判定
        let base = this.calcLineScore(lines);

        if (lines == 4) { //B2B
            if (this._backToBack) base *= 1.5;
            this._backToBack = true;
        }

        if (this._combo > 0) { //コンボ
            base += 50 * this._combo * this._level;
        }

        this._score += base * this._level;
        if (this._canLevelUp) this.updateLevel(lines);
    }

    calcLineScore(lines) { //スコアを計算
        return [0, 100, 300, 500, 800, 1200][lines] || 0;
    }

    updateLevel(lines) { //レベルアップ判定
        this._totalLines += lines;
        if (
            this._totalLines >= this.linesPerLevel &&
            this._level < this.maxLevel
        ) {
            this._level++;
            this._totalLines -= this.linesPerLevel;
            this._dropInterval = this.calcDropInterval();
            if (this._level >= this.maxLevel) this._canLevelUp = false;
        }
    }

    calcDropInterval() { //落下間隔を計算
        return 1000 - (this._level - 1) * 100;
    }

    //ゲッターセッター
    get score() { return this._score; }
    set score(v) { this._score = v; }

    get level() { return this._level; }
    set level(v) { this._level = v; }

    get combo() { return this._combo; }
    set combo(v) { this._combo = v; }

    get canLevelUp() { return this._canLevelUp; }
    set canLevelUp(v) { this._canLevelUp = v; }

    get totalLines() { return this._totalLines; }
    set totalLines(v) { this._totalLines = v; }

    get backToBack() { return this._backToBack; }
    set backToBack(v) { this._backToBack = v; }

    get dropInterval() { return this._dropInterval; }
}