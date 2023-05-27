import {EDITABLE_BLOCK_CSS_SELECTOR} from "./types";

export default new class TanaDOMNodeDecorator {
    public replaceContentNode(rootBlockNode:HTMLElement,newContentNode:HTMLElement) {
        if (!rootBlockNode) return
        const editableBlock = rootBlockNode.querySelector(EDITABLE_BLOCK_CSS_SELECTOR)
        if (!editableBlock) return
        const editableBlockContainer = editableBlock.parentElement
        if (!editableBlockContainer) return
        editableBlock.remove()
        editableBlockContainer.appendChild(newContentNode)
    }
}