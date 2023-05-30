import CodeButtonElement from "./CodeButtonElement";
import CodeLintingElement from "./CodeLintingElement";
import CodeBlockContainerElement from "./CodeBlockContainerElement";
import CodeInputElement from "./CodeInputElement";
import CodeEventHandler from "./CodeEventHandler";
import {ITanaReplacementElement} from "tana-extensions-core/src/TanaNodeReplacementHandler/types";
import {ITanaExtension} from "tana-extensions-core/src/TanaExtensionInitializer/types";
import {NodeEvent, NodeEventTypeEnum} from "tana-extensions-core/src/TanaDOMNodeListener/types";
import TanaDOMNodeDecorator from "tana-extensions-core/src/TanaDOMNodeDecorator";
import {CODE_BLOCK_INPUT_CSS_SELECTOR} from "./types";
import {TanaNode} from "tana-extensions-core/src/TanaStateProvider/types";
import TanaNodeReplacementHandler from "tana-extensions-core/src/TanaNodeReplacementHandler";
import "../css/main.css"

export default new class CodeBlockExtension implements ITanaReplacementElement, ITanaExtension {
    private highlightJS = 'highlightJS'
    public  uniqueIdentifier(): string {
        return "customTanaCodeBlock"
    }
    public  async replaceElement(nodeEvent:NodeEvent) {
        const codeBlockContainer = await this.createInstance(nodeEvent.tanaNode)
        TanaDOMNodeDecorator.replaceContentNode(nodeEvent.nodeElement,codeBlockContainer)
        CodeEventHandler.invokeInitialization(codeBlockContainer)
    }
    public  shouldReplace(nodeEvent:NodeEvent): boolean {
        if (nodeEvent.nodeEventType == NodeEventTypeEnum.Deletion) return false
        if (nodeEvent.isHeaderNode) return false
        const isCodeBlock = nodeEvent.tanaNode.isCodeBlock
        const isCustomCodeBlock = nodeEvent.nodeElement.querySelector(CODE_BLOCK_INPUT_CSS_SELECTOR)
        return isCodeBlock && !isCustomCodeBlock
    }
    public async createInstance(node:TanaNode): Promise<HTMLElement> {
        const codeButtonElement = CodeButtonElement.createInstance()
        const codeLintingElement = CodeLintingElement.createInstance()
        const codeBlockContainerElement = CodeBlockContainerElement.createInstance()
        const codeInputElement = CodeInputElement.createInstance()
        codeBlockContainerElement.appendChild(codeInputElement)
        codeBlockContainerElement.appendChild(codeLintingElement)
        codeBlockContainerElement.appendChild(codeButtonElement)
        codeInputElement.value = node.name
        const codeElement = codeLintingElement.firstChild as HTMLElement
        codeElement.innerHTML = node.name
        CodeEventHandler.registerBaseEventsForCodeBlock(codeBlockContainerElement)
        return codeBlockContainerElement as HTMLElement
    }
    public  register(): void {
        TanaNodeReplacementHandler.registerTanaReplacementElement(this)
    }
}