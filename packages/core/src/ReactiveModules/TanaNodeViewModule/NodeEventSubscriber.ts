import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import TanaNodeViewModule from "./index";
import {InitEvent} from "../EventBus/types/Event";
import NodeEvent, {NodeEventMessage} from "../TanaNodeEventModule/types/NodeEvent";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import { NodeEventTypeEnum } from "../TanaNodeEventModule/types/types";
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector";
import OnAppStateInitEvent from "../TanaLoaderModule/types/OnAppStateInitEvent";

export default class NodeEventSubscriber extends TanaSubscriber<TanaNodeViewModule> {

    getInitRequirements(): InitEvent[] {
        return [OnAppStateInitEvent];
    }

    meetsViewDeletionCritiera(event:RuntimeEventInstance<NodeEventMessage>):boolean {
        const {nodeEventType,nodeId,tanaNode} = event.message
        if (!(nodeEventType == NodeEventTypeEnum.Deletion || nodeEventType == NodeEventTypeEnum.BulletCollapse)) return false 
        if (!this.mediator.replacedNodeIds.has(nodeId)) return false 
        if (!TanaNodeAttributeInspector.getFirstTemplateWithSuperTag(tanaNode,'view-extension')) return false 
        return true 
    }

    meetsViewInsertionCriteria(event:RuntimeEventInstance<NodeEventMessage>):boolean {
        const {nodeEventType,nodeId,tanaNode,nodeElement,isHeaderNode} = event.message
        if (!(nodeEventType == NodeEventTypeEnum.Insertion || nodeEventType == NodeEventTypeEnum.BulletExpand)) return false 
        if (this.mediator.replacedNodeIds.has(nodeId)) return false 
        if (!isHeaderNode && !TanaNodeAttributeInspector.isExpandedNode(nodeElement)) return false
        if (!TanaNodeAttributeInspector.getFirstTemplateWithSuperTag(tanaNode,'view-extension')) return false 
        return true
    }

    handleNodeEvent(event:RuntimeEventInstance<NodeEventMessage>) {
        if (this.meetsViewInsertionCriteria(event)) {
            this.mediator.dispatchInsertViewEvent(event)
        }
        else if (this.meetsViewDeletionCritiera(event)) {
            this.mediator.dispatchRemoveViewEvent(event)
        }
    }
    
    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent(NodeEvent,this.handleNodeEvent.bind(this))
    }

}