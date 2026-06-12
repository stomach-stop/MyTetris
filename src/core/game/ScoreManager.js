import { eventBus } from "../common/EventBus.js";

export class ScoreManager {
    constructor(setting) {
        //変更可能な設定
        this.setting = setting;
        this.level = this.setting.level;
        this.canLevelUp = this.setting.canLevelUp;

        //変更不可な設定
        this.score = 0;
        this.combo = -1; 
        this.maxLevel = 20;
        this.totalLines = 0; //合計消去ライン数
        this.backToBack = false; //連続ボーナス
        this.linesPerLevel = 10; //レベルアップ間隔
        this._dropInterval = this.calcDropInterval(); //落下間隔

        //イベント購読
        eventBus.on("piece-locked", (data) => {
            this.onPieceLocked(data);
        });
        eventBus.on("soft-drop", () => {
            this.score += 1;
        });
        eventBus.on("hard-drop", ({dist}) => {
            this.score += dist * 2;
        });
    }

    onPieceLocked({ lines }) { //ミノ固定時の処理
        if (lines > 0 && lines < 4) this.backToBack = false; //B2B判定
        this.combo = (lines > 0) ? this.combo + 1 : -1; //コンボ判定
        let base = this.calcLineScore(lines);

        if (lines == 4) { //B2B
            if (this.backToBack) base *= 1.5;
            this.backToBack = true;
        }

        if (this.combo > 0) { //コンボ
            base += 50 * this.combo * this.level;
        }

        this.score += base * this.level;
        if (this.canLevelUp) this.updateLevel(lines);
    }

    calcLineScore(lines) { //スコアを計算
        return [0, 100, 300, 500, 800, 1200][lines] || 0;
    }

    updateLevel(lines) { //レベルアップ判定
        this.totalLines += lines;
        if (
            this.totalLines >= this.linesPerLevel &&
            this.level < this.maxLevel
        ) {
            this.level++;
            this.totalLines -= this.linesPerLevel;
            this._dropInterval = this.calcDropInterval();
            if (this.level >= this.maxLevel) this.canLevelUp = false;
        }
    }

    calcDropInterval() { //落下間隔を計算
        return 1000 - (this.level - 1) * 100;
    }

    createMemento() {
        return {
            score: this.score,
            level: this.level,
            combo: this.combo,
            canLevelUp: this.canLevelUp,
            totalLines: this.totalLines,
            backToBack: this.backToBack
        };
    }

    restore(memento) {
        this.score = memento.score;
        this.level = memento.level;
        this.combo = memento.combo;
        this.canLevelUp = memento.canLevelUp;
        this.totalLines = memento.totalLines;
        this.backToBack = memento.backToBack;
        this._dropInterval = this.calcDropInterval();
    }

    get dropInterval() { return this._dropInterval; }
}