export class PolyManager { //ブロックの出現制御
    constructor(board, factory) {
        this.board = board;
        this._factory = factory;

        this._current = this._factory.createNext(); //現在のブロック
        this._next = this._factory.createNext(); //次のブロック
        this._hold = null; //ホールド枠
        this.canHold = true; //ホールド可能か
        this._ghost; //ブロックの影
        this.updateGhost();
    }

    spawnNext() { //次のブロックを生成
        this._current = this._next;
        this._next = this._factory.createNext();
        this.canHold = true;
        this.updateGhost();
    }

    swapHold() { //ホールド枠のブロックと交換
        if (this.canHold) {
            if (this._hold != null) {
                const tmp = this._hold;
                this._hold = this._current;
                this._current = tmp;
            } else {
                this._hold = this._current;
                this.spawnNext();
            }
            
            this._current.x = 4;
            this._current.y = 0;
            this.canHold = false;
        }
    }

    updateGhost() { //ブロックの影を更新
        let clone = this._current.clone();
        while (this.board.canPlace(clone.cloneMoved(0, 1))) {
            clone = clone.cloneMoved(0, 1);
        }
        this._ghost = clone;
    }

    //ゲッターセッター
    get current() { return this._current; }
    set current(v) { this._current = v; }

    get next() { return this._next; }
    set next(v) { this._next = v; }

    get hold() { return this._hold; }
    set hold(v) { this._hold = v; }

    get ghost() { return this._ghost; }
}