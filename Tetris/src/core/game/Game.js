import { PolyManager } from "./PolyManager.js";
import { LockManager } from "./LockManager.js";
import { MoveManager } from "./MoveManager.js";
import { ScoreManager } from "./ScoreManager.js";
import { eventBus } from "../common/EventBus.js";
import { Memento } from "../common/Memento.js";

export class Game{ //ゲームの制御
    constructor(setting, board) {
        this.setting = setting;
        this.board = board;

        //設定の適用
        this.rand = this.setting.rand;
        this.strategy = this.setting.strategy;
        this.factory = this.setting.factory;
        
        //ゲーム管理
        this.poly = new PolyManager(this.board, this.factory);
        this.lock = new LockManager(this.board, this.poly);
        this.mover = new MoveManager(this.board, this.poly, () => this.lock.resetLockDelay());
        this._score = new ScoreManager(this.setting);
        this.lastDropTime = 0;
    }

    update(deltaTime) { //ゲームの更新
        this.lastDropTime += deltaTime;
        if (this.lastDropTime > this._score.dropInterval) {
            this.lastDropTime = 0;
            
            if (!this.mover.move(0, 1)) { //落下処理
                this.lock.startLockDelay();
            }
            
        }
        this.lock.updateLockDelay();
    }

    createMemento() {
        return new Memento({
            board: this.board.createMemento(),
            poly:  this.poly.createMemento(),
            score: this._score.createMemento(),
            seed:  this.rand.seed,
            bag:   [...this.strategy.bag]
        });
    }

    restore(memento) { //状態の復元
        const snap = memento.state;

        this.board.restore(snap.board);
        this.poly.restore(snap.poly);
        this._score.restore(snap.score);
        this.rand.seed = snap.seed;
        this.strategy.bag = [...snap.bag];
    }

    //ファザード
    swapHold()    { return this.poly.swapHold(); }
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
        eventBus.emit("hard-drop", { dist });
        this.lock.lockPiece();
    }

    get current() { return this.poly.current; }
    get next() { return this.poly.next; }
    get hold() { return this.poly.hold; }
    get score() { return this._score.score; }
    get ghost() { return this.poly.ghost; }
}