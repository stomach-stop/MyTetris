import { Board } from "./Board.js";
import { Game } from "./Game.js"
import { MenuState } from "../../state/MenuState.js";
import { PlayState } from "../../state/PlayState.js";
import { SettingState } from "../../state/SettingState.js";
import { UndoManager } from "./UndoManager.js";

export class GameManager { //ゲームの状態遷移
    constructor(){ //初期設定
        this.board = new Board();
        this.game = new Game(this.board);
        this.undo = new UndoManager(this.game);

        this.state = new MenuState();
        this.state.enter(this);
    }

    update(deltaTime) { //現在の状態を実行
        this.state.update(deltaTime);
    }

    render(ctx, tileSize) { //描画
        this.state.render(ctx, tileSize);
    }
    
    changeState(newState) { //状態遷移
        this.state = newState;
        this.state.enter(this);
    }

    menu() {
        this.changeState(new MenuState);
    }

    play() {
        this.changeState(new PlayState);
    }

    setting() {
        this.changeState(new SettingState);
    }
}