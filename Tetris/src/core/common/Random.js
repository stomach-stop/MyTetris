export class Random {
    constructor(seed = Date.now()) {
        this._seed = seed | 0;
    }

    next() {
        this._seed = this._seed + 0x6D2B79F5 | 0;
        let t = Math.imul(this._seed ^ this._seed >>> 15, 1 | this._seed);
        t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    get seed() { return this._seed; }
    set seed(v) { this._seed = v; }
}