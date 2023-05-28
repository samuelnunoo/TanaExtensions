import {CODE_BLOCK_CONTAINER_CSS_CLASS} from "./types";

export default new class CodeBlockContainerElement {
    public  createInstance() {
        const container = document.createElement("div")
        container.classList.add(CODE_BLOCK_CONTAINER_CSS_CLASS)
        return container
    }
}