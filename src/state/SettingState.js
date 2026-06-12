import { State } from "./State.js";
import { switchScreen } from "../../main.js";

export class SettingState extends State {
    enter() {
        switchScreen("setting");
    }

    update() {}
    
    render() {}
}