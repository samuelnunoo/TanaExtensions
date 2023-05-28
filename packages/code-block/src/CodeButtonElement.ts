import {CODE_BUTTON_CSS_CLASS} from "./types";


export default new class CodeButtonElement {
    public  createInstance() {
        const button = document.createElement("button")
        button.classList.add(CODE_BUTTON_CSS_CLASS)
        return button
    }
}