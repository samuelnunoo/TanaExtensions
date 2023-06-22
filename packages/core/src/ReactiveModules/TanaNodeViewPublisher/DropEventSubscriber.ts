import { Maybe } from "purify-ts";
import TanaNodeViewModule from ".";
import { InitEvent } from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import OnDropEvent, { DropEventContent, ON_DROP_DOM_EVENT } from "../TanaDragEventPublisher/types/OnDropEvent";
import OnStartEvent from "../TanaModuleLoader/types/OnStartEvent";

export default class DropEventSubscriber extends TanaSubscriber<TanaNodeViewModule> {
    getInitRequirements(): InitEvent[] {
       return [OnStartEvent]
    }
    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent(OnDropEvent,this.OnDropEvent.bind(this))
    }

    OnDropEvent(event:RuntimeEventInstance<DropEventContent>) {
        const {draggedContentNode,targetNodeViewContainer,nodeViewTemplateId} = event.message
        Maybe.fromNullable(this.mediator.getNodePortalStateHandler().getNodePortalState(targetNodeViewContainer))
            .chainNullable(portalStateHandler => {
                const {contentDomNode} = portalStateHandler.addContentNodeToPortal(draggedContentNode)
                const nodeViewStateHandler = this.mediator.getNodeViewStateHandler()
                const nodeViewConfig = nodeViewStateHandler.getEntry(nodeViewTemplateId)
                if (!nodeViewConfig) return

                const dispatchDomDropEvent = () => {
                    const dropEvent = new CustomEvent<DropEventContent>(ON_DROP_DOM_EVENT,{
                        detail:event.message,
                        bubbles:true 
                    })
                    event.message.dropTarget.dispatchEvent(dropEvent)
                }
                nodeViewConfig.OnDropEvent(event,portalStateHandler,contentDomNode,dispatchDomDropEvent)
            })      
    }

}