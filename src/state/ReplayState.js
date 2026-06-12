import { State } from "./State.js";
import { GameRenderer } from "../renderer/GameRenderer.js";
import { switchScreen } from "../../main.js";

export class ReplayState extends State {
    enter(manager) {
        switchScreen("game");
        this.renderer = new GameRenderer(manager.board);
        this.game = manager.game;
    }

    update(deltaTime) {
        this.game.update(deltaTime);
    }

    render(ctx, tileSize) {
        this.renderer.ctx = ctx;
        this.renderer.tileSize = tileSize;

        this.renderer.drawBoard();
        this.renderer.drawPolyomino(this.game.current);
        this.renderer.drawPolyomino(this.game.ghost, 0.3);
        this.renderer.drawNext(this.game.next);
        this.renderer.drawHold(this.game.hold);
        this.renderer.drawScore(this.game.score);
    }
}