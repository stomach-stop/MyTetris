export class PolyManager { //ブロックの出現制御
    constructor(board, factory) {
        this.board = board;
        this.factory = factory;

        this.current = this.factory.createNext(); //現在のブロック
        this.next = this.factory.createNext(); //次のブロック
        this.hold = null; //ホールド枠
        this.canHold = true; //ホールド可能か
        this.ghost = null; //ブロックの影
        this.updateGhost();
    }

    spawnNext() { //次のブロックを生成
        this.current = this.next;
        this.next = this.factory.createNext();
        this.canHold = true;
        this.updateGhost();
    }

    swapHold() { //ホールド枠のブロックと交換
        if (this.canHold) {
            if (this.hold != null) {
                const tmp = this.hold;
                this.hold = this.current;
                this.current = tmp;
            } else {
                this.hold = this.current;
                this.spawnNext();
            }
            
            this.current.x = 4;
            this.current.y = 0;
            this.canHold = false;
            this.updateGhost();
        }
    }

    updateGhost() { //ブロックの影を更新
        let clone = this.current.clone();
        while (this.board.canPlace(clone.cloneMoved(0, 1))) {
            clone = clone.cloneMoved(0, 1);
        }
        this.ghost = clone;
    }

    createMemento() {
        return {
            current: this.current.clone(),
            next: this.next.clone(),
            hold: this.hold?.clone() ?? null,
            ghost: this.ghost.clone()
        };
    }

    restore(memento) {
        this.current = memento.current.clone();
        this.next = memento.next.clone();
        this.hold = memento.hold ? memento.hold.clone() : null;
        this.ghost = memento.ghost.clone();
        this.updateGhost();
    }
}