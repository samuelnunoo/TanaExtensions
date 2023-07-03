import { Maybe } from "purify-ts";
import TanaNodeViewModule from ".";
import { InitEvent } from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import OnDropEvent, { DropEventContent } from "../TanaDragDropModule/types/OnDropEvent";
import OnStartEvent from "../TanaLoaderModule/types/OnStartEvent";
import NodeViewEventHandler from "./NodeViewEventHandler";

export default class DropEventSubscriber extends TanaSubscriber<TanaNodeViewModule> {
    
    getInitRequirements(): InitEvent[] {
       return [OnStartEvent]
    }
    
    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent(OnDropEvent,this.onDropEvent.bind(this))
    }

    onDropEvent(event:RuntimeEventInstance<DropEventContent>) {
        const {draggedContentNode,nodeElement,nodeViewTemplateId,isExpanded} = event.message
            Maybe.fromNullable(this.mediator.getNodePortalStateHandler().getNodePortalState(nodeElement))
                .chainNullable(portalStateHandler => {
                    const nodeViewStateHandler = this.mediator.getNodeViewStateHandler()
                    const nodeViewConfig = nodeViewStateHandler.getEntry(nodeViewTemplateId)
                    if (!nodeViewConfig) return

                    const shouldExpandNodePortals = isExpanded ? nodeViewConfig.expandedConfig().expandNodePortalsByDefault : nodeViewConfig.defaultConfig().expandNodePortalsByDefault
                    const nodePortal = portalStateHandler.addContentNodeToPortal(draggedContentNode,shouldExpandNodePortals)
                    this.mediator.getNodePortalResizeObserver().registerNodePortal(nodePortal,NodeViewEventHandler.portalResizeEventCallback(nodeElement,nodePortal))
                    NodeViewEventHandler.invokeDropEvent(event,portalStateHandler,nodePortal)
                })      
    }

}