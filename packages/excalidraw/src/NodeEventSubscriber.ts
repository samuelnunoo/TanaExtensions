import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber";
import ExcalidrawExtension from ".";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import DomNodePublisherInitEvent
    from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/DomNodePublisherInitEvent";
import NodeEvent, {
    NodeEventMessage
} from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/NodeEvent";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import TanaDomNodeDecorator from "tana-extensions-core/src/StaticModules/TanaDomNodeDecorator";
import {NodeEventTypeEnum} from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/types";
import {EXCALIDRAW_TEMPLATE_NAME} from "../types/types";
import TanaNodeAttributeInspector from "tana-extensions-core/src/StaticModules/TanaNodeAttributeInspector";
import OnDatabaseInitEvent from "database-extension/types/OnDatabaseInitEvent";
import {Maybe} from "purify-ts";


export default class NodeEventSubscriber extends TanaSubscriber<ExcalidrawExtension> {

    excalidrawInstanceIds = new Set()
    getInitRequirements(): InitEvent[] {
        return [
            OnDatabaseInitEvent,
            DomNodePublisherInitEvent,
        ]
    }

       replaceElement(nodeEvent: RuntimeEventInstance<NodeEventMessage>) {
        const {tanaNode,nodeElement,panel} = nodeEvent.message
        this.mediator.createInstance(tanaNode).then(excalidrawElement => {
            TanaDomNodeDecorator.insertAsView(nodeElement,panel,excalidrawElement)
        })
    }

    handleDeletion(nodeEvent: RuntimeEventInstance<NodeEventMessage>) {
        console.log("Deleting Excalidraw instance")
        const {nodeId} = nodeEvent.message
        this.excalidrawInstanceIds.delete(nodeId)
        Maybe.fromNullable(this.mediator.excalidrawInstances.get(nodeId))
            .map(root => root.unmount())
    }


    shouldDelete(nodeEvent: RuntimeEventInstance<NodeEventMessage>): boolean {
        const {nodeEventType,tanaNode,nodeId} = nodeEvent.message
        const isDeletion = nodeEventType == NodeEventTypeEnum.Deletion || nodeEventType == NodeEventTypeEnum.BulletCollapse
        const hasExcalidrawTemplate = TanaNodeAttributeInspector.hasTemplateWithName(tanaNode,EXCALIDRAW_TEMPLATE_NAME)
        const hasBeenReplaced = this.excalidrawInstanceIds.has(nodeId)
        return isDeletion && hasBeenReplaced && hasExcalidrawTemplate
    }
    shouldReplace(nodeEvent: RuntimeEventInstance<NodeEventMessage>): boolean {
        const {nodeEventType,tanaNode,nodeId} = nodeEvent.message
        const isDeletion = nodeEventType == NodeEventTypeEnum.Deletion || nodeEventType == NodeEventTypeEnum.BulletCollapse
        const hasAlreadyBeenReplaced = this.excalidrawInstanceIds.has(nodeId)
        const hasExcalidrawTemplate = TanaNodeAttributeInspector.hasTemplateWithName(tanaNode,EXCALIDRAW_TEMPLATE_NAME)
        if (hasExcalidrawTemplate) this.excalidrawInstanceIds.add(nodeId)
       return hasExcalidrawTemplate && !isDeletion && !hasAlreadyBeenReplaced
    }

    handleNodeEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        if (this.shouldReplace(event)) this.replaceElement(event)
        else if (this.shouldDelete(event))this.handleDeletion(event)
    }

    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent(NodeEvent,this.handleNodeEvent.bind(this))
    }

}