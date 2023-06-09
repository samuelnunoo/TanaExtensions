import TanaNodeAttributeEnforcer from "../TanaNodeAttributeInspector";
import TanaDomNodeProvider from "../TanaDomNodeProvider";

const VIEW_CONTAINER_CSS_SELECTOR = ".view-container"
const VIEW_CONTAINER_CLASS_NAME = "view-container"
const NON_TEMPLATE_CONTENT_CSS_SELECTOR = ".nonTemplateContent"

export default new class TanaDomNodeDecorator {
    public replaceHtmlDomNode(rootBlockNode:HTMLElement, newContentNode:HTMLElement) {
        if (!TanaNodeAttributeEnforcer.hasValidTanaNodeContent(rootBlockNode)) {
            throw new Error(`Provided node is not a valid Tana Content Node`)
        }
        const editableBlock = TanaDomNodeProvider.getEditableNodeFromAncestor(rootBlockNode)
        const editableBlockContainer = editableBlock!.parentElement
        editableBlock!.remove()
        editableBlockContainer!.appendChild(newContentNode)
    }

    public insertAsView(rootBlockNode:HTMLElement,panel:HTMLElement,viewNode:HTMLElement) {
        const nodeIsPanelHeader = TanaNodeAttributeEnforcer.hasPanelHeaderAttribute(rootBlockNode)
        const rootNode = nodeIsPanelHeader ? panel : rootBlockNode
        const nonTemplateContent = rootNode.querySelector(NON_TEMPLATE_CONTENT_CSS_SELECTOR) as HTMLElement
        if (!nonTemplateContent) return
        this.prependNodeToParent(nonTemplateContent,viewNode)
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

    private prependNodeToParent(parentNode:HTMLElement,childNode:HTMLElement) {
        if (parentNode.childNodes.length == 0) parentNode.appendChild(childNode)
        else parentNode.insertBefore(childNode,parentNode.firstChild)
    }

}
