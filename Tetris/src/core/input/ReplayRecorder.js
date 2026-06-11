export class ReplayRecorder { //リプレイを記録
    constructor() {
        this._inputs = [];
    }

    record(frame, key) {
        this._inputs.push({frame, key});
    }

    get inputs() { return [...this._inputs]; }
}