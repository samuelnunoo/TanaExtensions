import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import {InitEvent} from "../EventBus/types/Event";
import NodeReplacementPublisherInitEvent from "./types/events/NodeReplacementPublisherInitEvent";
import NodeEventSubscriber from './NodeEventSubscriber';
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import { NodeEventMessage } from "../TanaNodeEventModule/types/NodeEvent";
import ReplaceViewEvent, { ReplaceViewEnum } from "./types/events/ReplaceViewEvent";
import NodeViewStateHandler from "./NodeViewStateHandler";
import NodeViewReplacementSubscriber from "./NodeViewReplacementSubscriber";
import NodeViewDBCollectionPublisher from "./NodeViewDBCollectionPublisher";
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector";
import { Maybe } from 'purify-ts';
import "./assets/node-view.css"
import DropEventSubscriber from "./DropEventSubscriber";
import NodePortalStateHandler from "./NodePortalStateHandler";
import NodePortalResizeObserver from "../../StaticModules/NodePortalModule/NodePortalResizeObserver";
import NodePortalObserver from "./NodePortalObserver";


export default class TanaNodeViewModule extends TanaPubSubModule {
    private nodeViewStateHandler = new NodeViewStateHandler()
    private nodePortalStateHandler = new NodePortalStateHandler()
    private nodePortalResizeObserver = new NodePortalResizeObserver()
    private nodePortalObserver = new NodePortalObserver(this,this.eventBus)
    private nodeEventSubscriber = new NodeEventSubscriber(this,this.eventBus)
    private nodeViewPublisher: NodeViewReplacementSubscriber = new NodeViewReplacementSubscriber(this,this.eventBus)
    private nodeViewCollectionPublisher:NodeViewDBCollectionPublisher = new NodeViewDBCollectionPublisher(this,this.eventBus)
    private dropEventSubscriber:DropEventSubscriber = new DropEventSubscriber(this,this.eventBus)

    replacedNodeIds: Set<string> = new Set() 
    deletedNodeIds: Set<string> = new Set()

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.nodePortalObserver,
            this.nodeEventSubscriber,
            this.nodeViewPublisher,
            this.nodeViewCollectionPublisher,
            this.dropEventSubscriber
        ];
    }

    getNodePortalObserver() {
        return this.nodePortalObserver
    }

    getNodePortalResizeObserver() {
        return this.nodePortalResizeObserver
    }

    getNodeViewReplacementSubscriber() {
        return this.nodeViewPublisher
    }

    getNodePortalStateHandler() {
        return this.nodePortalStateHandler
    }

    getEventModuleInvokesOnCompletion(): InitEvent {
        return NodeReplacementPublisherInitEvent
    }

    getNodeEventSubscriber() {
        return this.nodeEventSubscriber
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