import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import {InitEvent} from "../EventBus/types/Event";
import NodeReplacementPublisherInitEvent from "./types/events/NodeReplacementPublisherInitEvent";
import NodeEventSubscriber from './NodeEventSubscriber';
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import { NodeEventMessage } from "../TanaDomNodeEventPublisher/types/NodeEvent";
import ReplaceViewEvent, { ReplaceViewEnum } from "./types/events/ReplaceViewEvent";
import NodeViewStateHandler from "./NodeViewStateHandler";
import NodeViewReplacementSubscriber from "./NodeViewReplacementSubscriber";
import NodeViewCollectionPublisher from "./NodeViewCollectionPublisher";
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector";
import { Maybe } from 'purify-ts';
import "./assets/node-view.css"

export default class TanaNodeViewModule extends TanaPubSubModule {
    private nodeEventSubscriber = new NodeEventSubscriber(this,this.eventBus)
    private nodeViewStateHandler = new NodeViewStateHandler()
    private nodeViewPublisher: NodeViewReplacementSubscriber = new NodeViewReplacementSubscriber(this,this.eventBus)
    private nodeViewCollectionPublisher:NodeViewCollectionPublisher = new NodeViewCollectionPublisher(this,this.eventBus)
    replacedNodeIds: Set<string> = new Set() 
    deletedNodeIds: Set<string> = new Set()

    getNodeViewReplacementSubscriber() {
        return this.nodeViewPublisher
    }

    getEventModuleInvokesOnCompletion(): InitEvent {
        return NodeReplacementPublisherInitEvent
    }

    getNodeEventSubscriber() {
        return this.nodeEventSubscriber
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.nodeEventSubscriber,
            this.nodeViewPublisher,
            this.nodeViewCollectionPublisher
        ];
    }

    getNodeViewStateHandler() {
        return this.nodeViewStateHandler
    }

    dispatchInsertViewEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        this.deletedNodeIds.delete(event.message.nodeId)
        this.replacedNodeIds.add(event.message.nodeId)
        const templateId = this.getTemplateIdFromEvent(event)
        if (!templateId) return 
        const replaceEvent = ReplaceViewEvent.createInstance({
            templateId,
            nodeEvent:event.message,
            type: ReplaceViewEnum.Insertion
        })
        this.eventBus.dispatchRuntimeEvent(replaceEvent)
    }

    dispatchRemoveViewEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        this.replacedNodeIds.delete(event.message.nodeId)
        this.deletedNodeIds.add(event.message.nodeId)
        const templateId = this.getTemplateIdFromEvent(event)
        if (!templateId) return 
        const replaceEvent = ReplaceViewEvent.createInstance({
            templateId,
            nodeEvent:event.message,
            type: ReplaceViewEnum.Deletion
        })
        this.eventBus.dispatchRuntimeEvent(replaceEvent)
    }

    private getTemplateIdFromEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        const {tanaNode} = event.message
        return Maybe.fromNullable(TanaNodeAttributeInspector.getFirstTemplateWithSuperTag(tanaNode,"view-extension"))
            .map(templateNode => templateNode.name)
            .extractNullable()
    }
}