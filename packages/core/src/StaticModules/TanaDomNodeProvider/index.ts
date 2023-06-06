import {
    DOM_NODE_CSS,
    TANA_DOCK_CSS_SELECTOR,
    TANA_PANEL_HEADER_CSS_SELECTOR,
    TANA_PANEL_HEADER_TEMPLATE_CONTAINER_CLASS_PREFIX, TANA_WRAPPER_CSS_CLASS,
    TANA_WRAPPER_CSS_SELECTOR
} from "./types";
import {
    BULLET_CONTENT_CSS_CLASS,
    BULLET_CONTENT_CSS_SELECTOR
} from "../../ReactiveModules/TanaDomNodeEventPublisher/types/types";
import {MAIN_PANEL_CSS_SELECTOR} from "../../ReactiveModules/TanaDomPanelEventPublisher/types/constants";
import TanaNodeAttributeInspector from "../TanaNodeAttributeInspector";

export default class TanaDomNodeProvider  {
    public static getAllContentNodesOnPage(dom:Document): HTMLElement[] {
        return Array.from(dom.querySelectorAll(DOM_NODE_CSS)) as HTMLElement[]
    }

    public static getPanelHeaderTemplateContainerFromPanel(panel:HTMLElement) {
        if (!panel) return
        const wrapper = panel.querySelector(TANA_WRAPPER_CSS_SELECTOR)
        if (!wrapper) return
        return this.getNodeWithClassPrefixFromArray(
            Array.from(wrapper.childNodes) as HTMLElement[],
            TANA_PANEL_HEADER_TEMPLATE_CONTAINER_CLASS_PREFIX
        )

     }


    public static getPanelHeaderFromPanel(panel:HTMLElement) {
        if (!panel) return
        return panel.querySelector(TANA_PANEL_HEADER_CSS_SELECTOR) as HTMLElement
    }
    public static getAllContentNodesOnPanel(panel:HTMLElement) {
        return Array.from(panel.querySelectorAll(DOM_NODE_CSS)) as HTMLElement[]
    }
    public static getBlockNodeFromDescendant(descendant:HTMLElement) {
        return descendant.closest(BULLET_CONTENT_CSS_SELECTOR)
    }
    public static getPanelFromNode(node: HTMLElement) {
        const mainPanel = node.closest(MAIN_PANEL_CSS_SELECTOR)
        if (!!mainPanel) return mainPanel as HTMLElement
        return node.closest(TANA_DOCK_CSS_SELECTOR) as HTMLElement
    }
    public static getAllContentNodesOnPageAsMap() {
        const map:Map<string,HTMLElement> = new Map()
        const domNodes = TanaDomNodeProvider.getAllContentNodesOnPage(document)
        domNodes.forEach(domNode => {
            const id = TanaDomNodeProvider.getIdFromElement(domNode)
            map.set(id!,domNode)
        })
        return map
    }
    public static getIdFromElement(element:HTMLElement){
       if (!element.classList.contains(BULLET_CONTENT_CSS_CLASS) && !element.classList.contains(TANA_WRAPPER_CSS_CLASS)) return null
        const dataId = element.getAttribute("data-id") || element.id
        if (!dataId || dataId == "") return null
        return dataId!.split("|").pop()
    }

    public static getNodeWithClassPrefixFromArray(elementArray:HTMLElement[],classPrefix:string) {
        for (const element of elementArray) {
            if (!('classList' in element)) continue
            for (const classItem of Array.from(element.classList)) {
                if (!!classItem.match(classPrefix)) return element
            }
        }
        return null
    }
    public static getNodeWithClassFromArray(elementArray:HTMLElement[],className:string) {
        for (const element of elementArray) {
            if (!('classList' in element)) continue
            if (element.classList.contains(className)) return element
        }
        return null
    }

}
