import { GameManager } from "./src/core/game/GameManager.js";
import { InputHandler } from "./src/core/input/InputHandler.js";

let canvas;
let ctx;
let tileSize;

let manager;
let handler;
let lastTime = 0;

//イベント
window.addEventListener("DOMContentLoaded", () => init());

function init() { //初期化
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    createDisplay();
    manager = new GameManager();
    handler = new InputHandler(manager);

    setupUI();

    window.addEventListener("keydown",  (e) => handler.onKeyDown(e.key));
    window.addEventListener("keyup",    (e) => handler.onKeyUp(e.key));
    window.addEventListener("resize",   ()  => createDisplay());

    requestAnimationFrame(loop); //次の描画でloopを実行
}

function loop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    manager.update(deltaTime);
    manager.render(ctx, tileSize);
    handler.update();

    requestAnimationFrame(loop);
}

function createDisplay() {
    const boardWidth = 20; //盤面の大きさ
    const boardHeight = 20;

    tileSize = Math.floor(Math.min( //タイルサイズを初期化
        window.innerWidth / boardWidth,
        window.innerHeight / boardHeight
    ));

    canvas.width = tileSize * boardWidth; //画面サイズを初期化
    canvas.height = tileSize * boardHeight;

    canvas.style.position = "absolute";
    canvas.style.left = `${(window.innerWidth  - canvas.width) / 2}px`;
    canvas.style.top  = `${(window.innerHeight - canvas.height) / 2}px`;
}

function setupUI() { //部品のイベントを設定
    const startBtn = document.getElementById("startBtn");
    startBtn.addEventListener("click", () => {
        manager.play();
    });

    const settingBtn = document.getElementById("settingBtn");
    settingBtn.addEventListener("click", () => {
        manager.setting();
    });

    const backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("click", () => {
        manager.menu();
    });
}

export function switchScreen(id) {
    document.querySelectorAll(".screen")
    .forEach(el => el.classList.add("hidden"));
    
    if (id) {
        document.getElementById(id)
        .classList.remove("hidden");
    }
}