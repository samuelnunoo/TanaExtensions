import {CODE_BLOCK_CSS_CLASS, CODE_BLOCK_INPUT_CSS_CLASS} from "./types";

export default new class CodeInputElement {

    public  createInstance(): HTMLTextAreaElement {
        const textarea = document.createElement("textarea")
        textarea.classList.add(CODE_BLOCK_INPUT_CSS_CLASS)
        textarea.classList.add(CODE_BLOCK_CSS_CLASS)
        return textarea
    }



}