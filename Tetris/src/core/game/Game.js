import { Random } from "../common/Random.js"
import { SevenBagStrategy } from "../../polyomino/strategy/SevenBagStrategy.js";
import { RandomStrategy } from "../../polyomino/strategy/RandomStrategy.js";
import { TetrominoFactory } from "../../polyomino/tetromino/TetrominoFactory.js";
import { PolyManager } from "./PolyManager.js";
import { LockManager } from "./LockManager.js";
import { MoveManager } from "./MoveManager.js";
import { ScoreManager } from "./ScoreManager.js";
import { eventBus } from "../common/EventBus.js";
import { Memento } from "../common/Memento.js";

export class Game{ //ゲームの制御
    constructor(board) {
        this.board = board;

        //生成方法の決定
        this.seed = 65535;
        this.rand = new Random(this.seed);
        this.strategy = new SevenBagStrategy(this.rand);
        //this.strategy = new RandomStrategy(this.rand);
        this.factory = new TetrominoFactory(this.strategy);
        
        //ゲーム管理
        this.poly = new PolyManager(this.board, this.factory);
        this.lock = new LockManager(this.board, this.poly);
        this.mover = new MoveManager(this.board, this.poly, () => this.lock.resetLockDelay());
        this._score = new ScoreManager();

        this.lastDropTime = 0; //落下記録
    }

    update(deltaTime) { //ゲームの更新
        this.lastDropTime += deltaTime;
        if (this.lastDropTime > this._score.dropInterval) {
            this.lastDropTime = 0;
            /*
            if (!this.mover.move(0, 1)) { //落下
                this.lock.startLockDelay();
            }
            */
        }
        this.lock.updateLockDelay();
    }

    createMemento() { //状態の保存
        return new Memento({
            grid:       this.grid.map(row => [...row]),
            //current:    this.current.clone(),
            //next:       this.next.clone(),
            hold:       this.hold?.clone() ?? null,
            score:      this.score,
            level:      this.level,
            combo:      this.combo,
            canLevelUp: this.canLevelUp,
            totalLines: this.totalLines,
            backToBack: this.backToBack,
            seed:       this.rand.seed,
        });
    }

    restore(memento) { //状態の復元
        const snap = memento.state;
        this.grid       = snap.grid.map(row => [...row]);
        //this.current    = snap.current.clone();
        //this.next       = snap.next.clone();
        this.hold       = snap.hold?.clone() ?? null;
        this.score      = snap.score;
        this.level      = snap.level;
        this.combo      = snap.combo;
        this.canLevelUp = snap.canLevelUp;
        this.totalLines = snap.totalLines;
        this.backToBack = snap.backToBack;
        this.rand.seed  = snap.seed;
        
        this.updateGhost();
        this._score.calcDropInterval();
    }

    //ファザード
    swapHold()    { return this.poly.swapHold(); }
    updateGhost() { return this.poly.updateGhost(); }
    moveLeft()    { return this.mover.move(-1, 0); }
    moveRight()   { return this.mover.move(1, 0); }
    rotateLeft()  { return this.mover.rotateLeft(); }
    rotateRight() { return this.mover.rotateRight(); }

    softDrop() { 
        const moved = this.mover.move(0, 1);
        if (moved) eventBus.emit("soft-drop");
    }
    hardDrop() {
        let dist = 0;
        while (this.mover.move(0, 1)) dist++;
        this.lock.lockPiece();
        eventBus.emit("hard-drop", { dist });
    }

    //ゲッターセッター
    get grid()        { return this.board.grid; }
    set grid(v)       { this.board.grid = v; }

    get current()     { return this.poly.current; }
    set current(v)    { this.poly.current = v; }

    get next()        { return this.poly.next; }
    set next(v)       { this.poly.next = v; }

    get hold()        { return this.poly.hold; }
    set hold(v)       { this.poly.hold = v; }

    get ghost()       { return this.poly.ghost; }

    get score()       { return this._score.score; }
    set score(v)      { this._score.score = v; }

    get level()       { return this._score.level; }
    set level(v)      { this._score.level = v; }

    get combo()       { return this._score.combo; }
    set combo(v)      { this._score.combo = v; }

    get canLevelUp()  { return this._score.canLevelUp; }
    set canLevelUp(v) { this._score.canLevelUp = v; }

    get totalLines()  { return this._score.totalLines; }
    set totalLines(v) { this._score.totalLines = v; }

    get backToBack()  { return this._score.backToBack; }
    set backToBack(v) { this._score.backToBack = v; }
}