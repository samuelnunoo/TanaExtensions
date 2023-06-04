import CodeButtonElement from "./CodeButtonElement";
import CodeLintingElement from "./CodeLintingElement";
import CodeBlockContainerElement from "./CodeBlockContainerElement";
import CodeInputElement from "./CodeInputElement";
import CodeEventHandler from "./CodeEventHandler";
import "../css/main.css"
import TanaExtension from "tana-extensions-core/src/types/TanaExtension"
import { TanaNode } from "tana-extensions-core/src/StaticModules/TanaStateProvider/types/types";
import { InitEvent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import { TanaPubSubComponent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import NodeEventSubscriber from "./NodeEventSubscriber";
import OnCodeBlockExtensionInitEvent from "./types/OnCodeBlockExtensionInitEvent";

export default class CodeBlockExtension extends TanaExtension {
  
    private NodeEventSubscriber = new NodeEventSubscriber(this,this.eventBus)

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

    getEventModuleInvokesOnCompletion(): InitEvent {
        return OnCodeBlockExtensionInitEvent
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.NodeEventSubscriber
        ];
    }

    getUniqueIdentifier(): string {
        return "customTanaCodeBlock";
    }
}