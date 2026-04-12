import { Factory } from "../base/PolyominoFactory.js";
import { Pentomino } from "./Pentomino.js";

export class PentominoFactory extends Factory {
    constructor(strategy) {
        super(strategy);
        this.Product = Pentomino;

        this.shapes = {
            F: { shape: [[0,1],[1,0],[1,1],[1,2],[2,2]], center: [1,1] },
            I: { shape: [[0,0],[1,0],[2,0],[3,0],[4,0]], center: [2,0] },
            L: { shape: [[3,0],[0,1],[1,1],[2,1],[3,1]], center: [2,1] },
            N: { shape: [[0,0],[1,0],[1,1],[2,1],[3,1]], center: [1,0] },
            P: { shape: [[0,0],[0,1],[1,1],[0,2],[1,2]], center: [0,1] },
            T: { shape: [[1,0],[0,1],[1,1],[2,1],[3,1]], center: [1,1] },
            U: { shape: [[0,0],[2,0],[0,1],[1,1],[2,1]], center: [1,1] },
            V: { shape: [[0,0],[0,1],[0,2],[1,2],[2,2]], center: [1,1] },
            W: { shape: [[0,0],[0,1],[1,1],[1,2],[2,2]], center: [1,1] },
            X: { shape: [[1,0],[0,1],[1,1],[2,1],[1,2]], center: [1,1] },
        };

        this.colors = {
            F: "#FF6B6B",
            I: "#4ECDC4",
            L: "#FF9F43",
            N: "#A29BFE",
            P: "#FD79A8",
            T: "#6C5CE7",
            U: "#00B894",
            V: "#E17055",
            W: "#FDCB6E",
            X: "#74B9FF",
        };
    }
}