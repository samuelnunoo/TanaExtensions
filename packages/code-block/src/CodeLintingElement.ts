import {CODE_BLOCK_CSS_CLASS, CODE_BLOCK_LINTING_CSS_CLASS, HLJS_CSS_CLASS} from "./types/types";


export default new class CodeLintingElement {
    public  createInstance() {
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        code.classList.add(CODE_BLOCK_LINTING_CSS_CLASS)
        code.classList.add(CODE_BLOCK_CSS_CLASS)
        code.classList.add(HLJS_CSS_CLASS)
        code.classList.add("language-javascript")
        pre.appendChild(code)
        return pre
    }
}
