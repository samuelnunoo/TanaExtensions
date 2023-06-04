import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber";
import ExcalidrawExtension from ".";
import { InitEvent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import DomNodePublisherInitEvent from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/DomNodePublisherInitEvent";
import NodeEvent, { NodeEventMessage } from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/NodeEvent";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import TanaDomNodeDecorator from "tana-extensions-core/src/StaticModules/TanaDomNodeDecorator";
import { NodeEventTypeEnum } from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/types";
import { EXCALIDRAW_CLASS_CSS_SELECTOR, EXCALIDRAW_TEMPLATE_NAME } from "./types";
import TanaNodeAttributeInspector from "tana-extensions-core/src/StaticModules/TanaNodeAttributeInspector";




export default class NodeEventSubscriber extends TanaSubscriber<ExcalidrawExtension> {
    
    getInitRequirements(): InitEvent[] {
        return [
            DomNodePublisherInitEvent
        ]
  
    }

    async replaceElement(nodeEvent: RuntimeEventInstance<NodeEventMessage>) {
        const {tanaNode,nodeElement,panel} = nodeEvent.message
        const excalidrawElement = await this.mediator.createInstance(tanaNode)
        TanaDomNodeDecorator.insertAsView(nodeElement,panel,excalidrawElement)
    }

    shouldReplace(nodeEvent: RuntimeEventInstance<NodeEventMessage>): boolean {
        const {nodeEventType,nodeElement,tanaNode} = nodeEvent.message
        if (nodeEventType == NodeEventTypeEnum.Deletion) return false
        const hasExcalidrawClass = !!nodeElement.querySelector(EXCALIDRAW_CLASS_CSS_SELECTOR)
        console.log(nodeEvent,hasExcalidrawClass)
       return TanaNodeAttributeInspector.hasTemplateWithName(tanaNode,EXCALIDRAW_TEMPLATE_NAME)
        && !hasExcalidrawClass
    }

    handleNodeEvent(event:RuntimeEventInstance<NodeEventMessage>) {
      if (!this.shouldReplace(event)) return 
      this.replaceElement(event)
    }

    onInitComplete() {
        this.subscribeToRuntimeEvent(NodeEvent,this.handleNodeEvent.bind(this))
    }

}