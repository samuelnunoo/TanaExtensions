import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber"
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event"
import DomNodePublisherInitEvent from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/DomNodePublisherInitEvent"
import NodeEvent, {
    NodeEventMessage
} from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/NodeEvent"
import {CODE_BLOCK_INPUT_CSS_SELECTOR} from "./types/types";
import CodeEventHandler from "./CodeEventHandler";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import { NodeEventTypeEnum } from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/types";
import CodeBlockExtension from ".";
import TanaDomNodeDecorator from "tana-extensions-core/src/StaticModules/TanaDomNodeDecorator"

export default class NodeEventSubscriber extends TanaSubscriber<CodeBlockExtension> {
    getInitRequirements(): InitEvent[] {
        return [DomNodePublisherInitEvent];
    }

    public shouldReplace(nodeEvent:RuntimeEventInstance<NodeEventMessage>): boolean {
        const {nodeEventType,isHeaderNode,tanaNode, nodeElement} = nodeEvent.message
        if (nodeEventType == NodeEventTypeEnum.Deletion) return false
        if (isHeaderNode) return false
        const isCodeBlock = tanaNode.isCodeBlock
        const isCustomCodeBlock = nodeElement.querySelector(CODE_BLOCK_INPUT_CSS_SELECTOR)
        return isCodeBlock && !isCustomCodeBlock
    }

    public async replaceElement(nodeEvent:RuntimeEventInstance<NodeEventMessage>) {
        const {tanaNode,nodeElement} = nodeEvent.message
        const codeBlockContainer = await this.mediator.createInstance(tanaNode)
        TanaDomNodeDecorator.replaceContentNode(nodeElement,codeBlockContainer)
        CodeEventHandler.invokeInitialization(codeBlockContainer)
    }

    public async handleRequest(nodeEvent:RuntimeEventInstance<NodeEventMessage>) {
            if (!this.shouldReplace(nodeEvent)) return 
            await this.replaceElement(nodeEvent)
    }

    onInitComplete() {
        this.subscribeToRuntimeEvent(NodeEvent,this.handleRequest.bind(this))
    }



}