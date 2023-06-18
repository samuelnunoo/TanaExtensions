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
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector";
import {NodeViewType} from "../TanaNodeViewPublisher/types/configs/NodeViewType";
import {TanaNode} from "../../StaticModules/TanaStateProvider/types/types";

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
                nodeViewType: this.getNodeViewType(tanaNode,panel),
                panel,
                nodeType: NodeElementType.BulletAndContent,
                isHeaderNode:false
            })
        })
    }

    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent<PanelEventMessage>(PanelEvent,this.onPanelEvent.bind(this))
    }

    private getNodeViewType(tanaNode:TanaNode,panel:HTMLElement) {
       return TanaNodeAttributeInspector.isPanelHeader(tanaNode,panel) ?  NodeViewType.Expanded : NodeViewType.Default
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
            nodeViewType: this.getNodeViewType(tanaNode,panel),
            panel,
            nodeEventType,
            nodeType: NodeElementType.BulletAndContent,
            nodeId,
        })
    }

}