export class GameRenderer { //描画処理
    constructor(board) {
        this.board = board;
        this.ctx = null;
        this.tileSize = 0;
        this.layout = { //盤面との相対位置
            next: { x: 1, y: 2 },
            hold: { x: 1, y: 8 },
            score: { x:1, y: 14 }
        };

        this.frameW = 6; //フレームの幅
        this.frameH = 4; //フレームの高さ
    }

    drawBoard() { //ボードを描画
        for (let i = 0; i < this.board.height; i++) {
            for (let j = 0; j < this.board.width; j++) {
                const cell = this.board.grid[i][j];

                this.ctx.fillStyle = cell ? cell.color : "white";
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 1;
                this.ctx.fillRect(
                    j * this.tileSize,
                    i * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
                this.ctx.strokeRect(
                    j * this.tileSize,
                    i * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }

    drawPolyomino(polyomino, alpha = 1.0) { //ブロックを描画
        if (!polyomino) return;
        this.ctx.fillStyle = polyomino.color;
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = alpha; //透明度

        for (const [x, y] of polyomino.pos) {
            this.ctx.fillRect(
                x * this.tileSize,
                y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
            this.ctx.strokeRect(
                x * this.tileSize,
                y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        }

        this.ctx.globalAlpha = 1.0; //デフォルトに戻す
    }

    drawFrame(x, y) {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;

        this.ctx.strokeRect(
            x * this.tileSize,
            y * this.tileSize,
            this.frameW * this.tileSize,
            this.frameH * this.tileSize
        );
    }

    drawNext(next) {
        const { x, y } = this.layout.next;
        const fx = this.board.width + x;
        this.drawFrame(fx, y);

        if (next == null) return;
        const clone = next.cloneMovedTo(fx + 1, y + 1);
        this.drawPolyomino(clone);
    }

    drawHold(hold) {
        const { x, y } = this.layout.hold;
        const fx = this.board.width + x;
        this.drawFrame(fx, y);

        if (hold == null) return;
        const clone = hold.cloneMovedTo(fx + 1, y + 1);
        this.drawPolyomino(clone);
    }

    drawScore(score) {
        const { x, y } = this.layout.score;
        const fx = this.board.width + x;
        this.drawFrame(fx, y);

        this.ctx.font = "24px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.ctx.fillText(
            `${score}`,
            (fx + this.frameW/2) * this.tileSize,
            (y + this.frameH/2) * this.tileSize
        );
    }
}