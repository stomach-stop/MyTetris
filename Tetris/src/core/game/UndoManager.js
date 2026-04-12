import { eventBus } from "../common/EventBus.js";

export class UndoManager {
    constructor(game) {
        this.game = game;
        this.history = [this.game.createMemento()];
        this.cursor = 0;

        eventBus.on("save", () => {
            this.history = this.history.slice(0, this.cursor + 1);
            this.history.push(this.game.createMemento());
            this.cursor++;
        });
        eventBus.on("undo", () => this.undo());
    }

    undo() {
        if (this.cursor <= 0) return;
        this.cursor--;
        this.game.restore(this.history[this.cursor])
    }
}