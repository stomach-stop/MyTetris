import { State } from "./State.js";
import { switchScreen } from "../../main.js";

export class MenuState extends State {
    enter() {
        switchScreen("menu");
    }

    update() {}
    
    render() {}
}