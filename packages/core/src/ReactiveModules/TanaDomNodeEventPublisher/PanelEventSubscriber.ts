import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import {InitEvent} from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import PanelEvent, {PanelEventMessage} from "../TanaDomPanelEventPublisher/types/PanelEvent";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import TanaStateProvider from "../../StaticModules/TanaStateProvider";
import NodeHelper from "./NodeHelper";
import {NodeEventTypeEnum} from "./types/types";
import TanaDomNodeEventModule from "./index";
import OnDomRenderCompleteEvent from "../TanaModuleLoader/types/OnDomRenderCompleteEvent";
import {NodeElementType} from "./types/NodeEvent";

export default class PanelEventSubscriber extends TanaSubscriber<TanaDomNodeEventModule> {
    getInitRequirements(): InitEvent[] {
        return [
            OnDomRenderCompleteEvent
        ]
    }
    
    onPanelEvent(event:RuntimeEventInstance<PanelEventMessage>) {
        const {panel,panelEventType} = event.message
        const contentNodes = TanaDomNodeProvider.getAllContentNodesOnPanel(panel)
        const panelHeaderNode = TanaDomNodeProvider.getPanelHeaderFromAncestor(panel)
        const nodeEventType = NodeHelper.getNodeEventType(panelEventType)
        
        this.createEventForPanelHeaderNode(panelHeaderNode as HTMLElement,panel,nodeEventType)
        contentNodes.forEach(nodeElement => {
            const nodeId = TanaDomNodeProvider.getIdFromElement(nodeElement)
            if (!nodeId) return
            const tanaNode = TanaStateProvider.getNodeWithId(nodeId).extract()
            if (!tanaNode) return
            this.mediator.invokeNodeEvent({
                nodeElement,
                tanaNode,
                nodeId,
                nodeEventType,
                panel,
                nodeType: NodeElementType.BulletAndContent,
                isHeaderNode:false
            })
        })
    }

    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent<PanelEventMessage>(PanelEvent,this.onPanelEvent.bind(this))
    }
    
    private createEventForPanelHeaderNode(
        panelHeaderNode:HTMLElement|null|undefined,panel:HTMLElement,nodeEventType:NodeEventTypeEnum
    ) {
        if (!panelHeaderNode) return
        const wrapperNode =  TanaDomNodeProvider.getWrapperNodeFromAncestor(panelHeaderNode)
        if (!wrapperNode) return
        const nodeId = wrapperNode.id
        if (!nodeId) return
        const tanaNode = TanaStateProvider.getNodeWithId(nodeId).extract()
        if (!tanaNode) return
        this.mediator.invokeNodeEvent({
            nodeElement:panelHeaderNode,
            tanaNode:tanaNode,
            isHeaderNode:true,
            panel,
            nodeEventType,
            nodeType: NodeElementType.BulletAndContent,
            nodeId,
        })
    }

}