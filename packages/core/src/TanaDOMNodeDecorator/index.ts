import {
    EDITABLE_BLOCK_CSS_SELECTOR,
    NON_TEMPLATE_CONTENT_CSS_SELECTOR,
    VIEW_CONTAINER_CLASS_NAME,
    VIEW_CONTAINER_CSS_SELECTOR
} from "./types";
import TanaNodeAttributeEnforcer from "../TanaNodeAttributeInspector";

export default new class TanaDOMNodeDecorator {
    public replaceContentNode(rootBlockNode:HTMLElement,newContentNode:HTMLElement) {
        if (!TanaNodeAttributeEnforcer.hasValidTanaNodeContent(rootBlockNode)) {
            throw new Error(`Provided node is not a valid Tana Content Node`)
        }
        const editableBlock = rootBlockNode.querySelector(EDITABLE_BLOCK_CSS_SELECTOR)
        const editableBlockContainer = editableBlock!.parentElement
        editableBlock!.remove()
        editableBlockContainer!.appendChild(newContentNode)
    }


    public insertAsView(rootBlockNode:HTMLElement,viewNode:HTMLElement) {
        const hasNonTemplateContent = rootBlockNode.querySelector(NON_TEMPLATE_CONTENT_CSS_SELECTOR)
        const hasExpandedNodeContent =
        if (hasNonTemplateContent) this.prependToNonTempalteContent(rootBlockNode,viewNode)

    }

    private prependToNonTempalteContent(rootBlockNode:HTMLElement,newContentNode:HTMLElement) {

    }

    private insertToExpandedNodeContent(rootBlockNode:HTMLElement,newContentNode:HTMLElement) {
        const expandedNodeContent = rootBlockNode.querySelector(NON_TEMPLATE_CONTENT_CSS_SELECTOR)
        if (!expandedNodeContent) return
        expandedNodeContent.insertBefore(newContentNode,expandedNodeContent.firstChild)
    }
    public wrapNodeWithViewContainer(contentNode:HTMLElement):HTMLElement {
        const container = document.createElement("div")
        container.classList.add(VIEW_CONTAINER_CLASS_NAME)
        const events = ["mousedown","click","pointerdown"]
        events.forEach(event => {
            container.addEventListener(event, (e) => {
                e.stopPropagation()
            })
        })
        container.addEventListener("focus",(e) => {
            if (!(e.target as HTMLElement).closest(VIEW_CONTAINER_CSS_SELECTOR)) {
                e.preventDefault()
            }
        })
        container.appendChild(contentNode)
        return container
    }
}
