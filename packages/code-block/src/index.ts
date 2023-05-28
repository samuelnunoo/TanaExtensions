import CodeButtonElement from "./CodeButtonElement";
import CodeLintingElement from "./CodeLintingElement";
import CodeBlockContainerElement from "./CodeBlockContainerElement";
import CodeInputElement from "./CodeInputElement";
import CodeEventHandler from "./CodeEventHandler";
import {ITanaReplacementElement} from "../../TanaNodeReplacementHandler/types";
import {highlightJS} from "../../TanaLibraryProvider/types";
import {CODE_BLOCK_INPUT_CSS_SELECTOR} from "./types";
import {ITanaExtension} from "../../TanaExtensionInitializer/types";
import TanaNodeReplacementHandler from "../../TanaNodeReplacementHandler";
import {NodeEvent, NodeEventTypeEnum} from "../../TanaDOMNodeListener/types"
import {TanaNode} from "../../TanaStateProvider/types";
import TanaDOMNodeDecorator from "../../TanaDOMNodeDecorator";

export default new class CodeBlockElement implements ITanaReplacementElement, ITanaExtension {
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