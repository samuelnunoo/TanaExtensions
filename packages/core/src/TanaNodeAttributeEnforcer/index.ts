import {BULLET_CONTENT_CSS_CLASS} from "../TanaDOMNodeListener/types";
import {EDITABLE_BLOCK_CSS_SELECTOR} from "../TanaDOMNodeDecorator/types";


export default new class TanaNodeAttributeEnforcer {

    public isValidTanaContentNode(node:HTMLElement) {
        if (!node) return false
        if (!('classList' in node)) return false
        if (!node.classList.contains(BULLET_CONTENT_CSS_CLASS)) return false
        if (! node.querySelector(EDITABLE_BLOCK_CSS_SELECTOR)) return false
        return true
    }
}