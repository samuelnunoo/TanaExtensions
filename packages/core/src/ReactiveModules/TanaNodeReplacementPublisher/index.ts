import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import {InitEvent} from "../EventBus/types/Event";
import NodeReplacementPublisherInitEvent from "./types/NodeReplacementPublisherInitEvent";
import NodeEventSubscriber from './NodeEventSubscriber';
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import { NodeEventMessage } from "../TanaDomNodeEventPublisher/types/NodeEvent";


export default class TanaNodeReplacementPublisher extends TanaPubSubModule {
    nodeEventSubscriber = new NodeEventSubscriber(this,this.eventBus)
    replacedNodeIds: Set<string> = new Set() 
    deletedNodeIds: Set<string> = new Set() 

    getEventModuleInvokesOnCompletion(): InitEvent {
        return NodeReplacementPublisherInitEvent
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.nodeEventSubscriber
        ];
    }

    dispatchInsertViewEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        this.deletedNodeIds.delete(event.message.nodeId)
        this.replacedNodeIds.add(event.message.nodeId)
        this.eventBus.dispatchRuntimeEvent(event)
    }

    dispatchRemoveViewEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        this.replacedNodeIds.delete(event.message.nodeId)
        this.deletedNodeIds.add(event.message.nodeId)
        this.eventBus.dispatchRuntimeEvent(event)

    }


}