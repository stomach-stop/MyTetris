import { Strategy } from "./strategy.js";

export class RandomStrategy extends Strategy {
    constructor(rand) {
        super(rand);
    }

    nextType(shapes) {
        const types = Object.keys(shapes);
        return types[Math.floor(this.rand.next() * types.length)];
    }
}