import {DOM_NODE_CSS, TANA_DOCK_CSS_SELECTOR} from "./types";
import {MAIN_PANEL_CSS_SELECTOR} from "../TanaDomPanelListener/types";
import {BULLET_CONTENT_CSS_SELECTOR} from "../TanaDOMNodeListener/types";
import {EDITABLE_BLOCK_CSS_SELECTOR} from "../TanaDOMNodeDecorator/types";

export default class TanaDomNodeProvider  {
    public static getAllContentNodesOnPage(): HTMLElement[] {
        return Array.from(document.querySelectorAll(DOM_NODE_CSS)) as HTMLElement[]
    }
    public static getAllEditableNodesOnPanel(panel:HTMLElement) {
        return Array.from(panel.querySelectorAll(EDITABLE_BLOCK_CSS_SELECTOR)) as HTMLElement[]
    }
    public static getBlockNodeFromDescendant(descendant:HTMLElement) {
        return descendant.closest(BULLET_CONTENT_CSS_SELECTOR)
    }
    public static getPanelFromNode(node: HTMLElement) {
        const mainPanel = node.closest(MAIN_PANEL_CSS_SELECTOR)
        if (!!mainPanel) return mainPanel as HTMLElement
        return node.closest(TANA_DOCK_CSS_SELECTOR)
    }
    public static getAllContentNodesOnPageAsMap() {
        const map:Map<string,HTMLElement> = new Map()
        const domNodes = TanaDomNodeProvider.getAllContentNodesOnPage()
        domNodes.forEach(domNode => {
            const id = TanaDomNodeProvider.getIdFromElement(domNode)
            map.set(id!,domNode)
        })
        return map
    }
    public static getIdFromElement(element:HTMLElement){
        const dataId = element.getAttribute("data-id")
        if (!dataId) return null
        return dataId!.split("|").pop()
    }
    public static getNodeWithClassFromArray(elementArray:HTMLElement[],className:string) {
        for (const element of elementArray) {
            if (!('classList' in element)) continue
            if (element.classList.contains(className)) return element
        }
        return null
    }

}
