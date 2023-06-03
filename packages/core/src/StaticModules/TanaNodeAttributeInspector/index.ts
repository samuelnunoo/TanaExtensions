import {BULLET_CONTENT_CSS_CLASS} from "../../ReactiveModules/TanaDomNodeEventPublisher/types/types";
import {EDITABLE_BLOCK_CSS_SELECTOR} from "../TanaDomNodeDecorator/types";
import {TanaNode} from "../../ReactiveModules/TanaStateProvider/types/types";
import {TANA_PANEL_HEADER_ATTRIBUTE, TANA_PANEL_HEADER_CSS_SELECTOR} from "../TanaDomNodeProvider/types";

export default new class TanaNodeAttributeInspector {

    public hasValidTanaNodeContent(node:HTMLElement) {
        if (!this.isValidClassNode(node)) return false
        if (!node.classList.contains(BULLET_CONTENT_CSS_CLASS)) return false
        if (! node.querySelector(EDITABLE_BLOCK_CSS_SELECTOR)) return false
        return true
    }

    public hasPanelHeaderAttribute(node:HTMLElement) {
        if (!this.isValidClassNode(node)) return false
        return node.getAttribute(TANA_PANEL_HEADER_ATTRIBUTE) != null
    }
    public hasTemplateWithName(tanaNode:TanaNode,templateName:string) {
        if (!tanaNode.templates) return false
        for (const template of tanaNode.templates) {
            if (template.name == templateName) return true
        }
        return false
    }

    private isValidClassNode(node:HTMLElement) {
        if (!node) return false
        if (!('classList' in node)) return false
        return true
    }
}