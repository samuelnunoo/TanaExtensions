import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import {InitEvent} from "../EventBus/types/Event";
import NodeReplacementPublisherInitEvent from "./types/NodeReplacementPublisherInitEvent";
import NodeEventSubscriber from './NodeEventSubscriber';
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import { NodeEventMessage } from "../TanaDomNodeEventPublisher/types/NodeEvent";
import ReplaceViewEvent, { ReplaceViewEnum } from "./types/ReplaceViewEvent";
import NodeViewStateHandler from "./NodeViewStateHandler";


export default class TanaViewReplacementPublisher extends TanaPubSubModule {
    private nodeEventSubscriber = new NodeEventSubscriber(this,this.eventBus)
    private nodeViewStateHandler = new NodeViewStateHandler()
    private replacedNodeIds: Set<string> = new Set() 
    private deletedNodeIds: Set<string> = new Set() 

    getEventModuleInvokesOnCompletion(): InitEvent {
        return NodeReplacementPublisherInitEvent
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.nodeEventSubscriber
        ];
    }

    getNodeViewStateHandler() {
        return this.nodeViewStateHandler
    }

    dispatchInsertViewEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        this.deletedNodeIds.delete(event.message.nodeId)
        this.replacedNodeIds.add(event.message.nodeId)
        const replaceEvent = ReplaceViewEvent.createInstance({
            nodeEvent:event.message,
            type: ReplaceViewEnum.Insertion
        })
        this.eventBus.dispatchRuntimeEvent(replaceEvent)
    }

    dispatchRemoveViewEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        this.replacedNodeIds.delete(event.message.nodeId)
        this.deletedNodeIds.add(event.message.nodeId)
        const replaceEvent = ReplaceViewEvent.createInstance({
            nodeEvent:event.message,
            type: ReplaceViewEnum.Deletion
        })
        this.eventBus.dispatchRuntimeEvent(replaceEvent)

    }
}