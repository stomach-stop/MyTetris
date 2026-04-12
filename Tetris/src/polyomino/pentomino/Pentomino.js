import { Polyomino } from "../base/Polyomino.js";

export class Pentomino extends Polyomino {
    constructor(type, shape, center, color, x, y) {
        super(type, shape, center, color, x, y);
    }

    static SRS = {
        "0>R": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
        "R>0": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],

        "R>2": [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
        "2>R": [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],

        "2>L": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
        "L>2": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],

        "L>0": [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
        "0>L": [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    };

    get table() { return Pentomino.SRS }

    mirror() { //左右反転
        this.mirrored = !this.mirrored;
        const xs = this.pos.map(([x]) => x);
        const maxX = Math.max(...xs);
        this.pos = this.pos.map(([x, y]) => [maxX - x, y]);
    }
}