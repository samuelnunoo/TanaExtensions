import {EDITABLE_BLOCK_CSS_SELECTOR} from "./types";
import TanaNodeAttributeEnforcer from "../TanaNodeAttributeEnforcer";

export default new class TanaDOMNodeDecorator {
    public replaceContentNode(rootBlockNode:HTMLElement,newContentNode:HTMLElement) {
        if (!TanaNodeAttributeEnforcer.isValidTanaContentNode(rootBlockNode)) {
            throw new Error(`Provided node is not a valid Tana Content Node`)
        }
        const editableBlock = rootBlockNode.querySelector(EDITABLE_BLOCK_CSS_SELECTOR)
        const editableBlockContainer = editableBlock!.parentElement
        editableBlock!.remove()
        editableBlockContainer!.appendChild(newContentNode)
    }
}
