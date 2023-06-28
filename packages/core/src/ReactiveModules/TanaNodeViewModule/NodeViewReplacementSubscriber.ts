import TanaViewReplacementPublisher from ".";
import { InitEvent } from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import RegisterNodeViewEvent, { RegisterNodeViewMessage } from "./types/events/RegisterNodeViewEvent";
import OnDatabaseInitEvent from "database-extension/types/events/OnDatabaseInitEvent";
import NodeViewCollection from "./types/database/NodeViewCollection";
import ReplaceViewEvent, {ReplaceViewEventMessage} from "./types/events/ReplaceViewEvent";
import TanaNodeViewCreator from "../../StaticModules/TanaNodeViewCreator";
import {Maybe} from "purify-ts";
import NodeViewConfig from "./types/configs/NodeViewConfig";
import GetNodeDataEvent from 'database-extension/types/events/GetNodeDataEvent';
import { NodeEventTypeEnum } from "../TanaNodeEventModule/types/types";
import TanaNodePortalState from "../../StaticModules/NodePortalModule/TanaNodePortalRenderer/TanaNodePortalState";
import NodeViewEventHandler from "./NodeViewEventHandler";


export default class NodeViewReplacementSubscriber extends TanaSubscriber<TanaViewReplacementPublisher> {

    getInitRequirements(): InitEvent[] {
        return [
            OnDatabaseInitEvent
        ]
    }

    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent(ReplaceViewEvent,this.onReplaceNodeView.bind(this))
        this.subscribeToRuntimeEvent(RegisterNodeViewEvent,this.onRegisterNodeView.bind(this))
    }

    onReplaceNodeView(event:RuntimeEventInstance<ReplaceViewEventMessage>) {
        const stateHandler = this.mediator.getNodeViewStateHandler()
        Maybe.fromNullable(stateHandler.getEntry(event.message.templateId))
            .map(async nodeViewConfig => {
                const {nodeEventType} = event.message.nodeEvent
                const isInsertionEvent = nodeEventType == NodeEventTypeEnum.Insertion || 
                    nodeEventType == NodeEventTypeEnum.BulletExpand
                
                const isDeletionEvent = nodeEventType == NodeEventTypeEnum.Deletion ||
                    nodeEventType == NodeEventTypeEnum.BulletCollapse

                if (isInsertionEvent) this.createNodeView(event,nodeViewConfig)
                else if (isDeletionEvent) this.deleteNodeView(event,nodeViewConfig)
         
            })
    }

    async onRegisterNodeView({message}:RuntimeEventInstance<RegisterNodeViewMessage>) {
        const {config} = message
        const dataRequestEvent = GetNodeDataEvent.createInstance({collection:NodeViewCollection, nodeId:config.templateName()})
        const response = await this.dispatchEventAndAWaitFirstReply(dataRequestEvent,3) as NodeViewConfig<any>
        const configData:NodeViewConfig<any> = response ? {...config,...response} as NodeViewConfig<any> : config
        this.mediator.getNodeViewStateHandler().addEntry(config.templateName(),configData)
    }

    private async createNodeView(event:RuntimeEventInstance<ReplaceViewEventMessage>,config:NodeViewConfig<any>) {
        const portalObserver = this.mediator.getNodePortalObserver()
        const nodePortalState = new TanaNodePortalState(event.message.nodeEvent.tanaNode,portalObserver)
        const eventHandlers = NodeViewEventHandler.getEventHandlers(event.message.nodeEvent.nodeElement)
        const nodeView = await config.createNodeView(event.message.nodeEvent,nodePortalState,eventHandlers)

        this.registerResizeObservers(event.message.nodeEvent.nodeElement,nodePortalState);
        this.mediator.getNodePortalStateHandler().addNodePortalState(event.message.nodeEvent.nodeElement,nodePortalState)
        TanaNodeViewCreator.renderNodeView(event,config,nodeView)
    }

    private registerResizeObservers(nodeElement:HTMLElement,nodePortalState: TanaNodePortalState) {
        const nodePortalResizeObserver = this.mediator.getNodePortalResizeObserver();
        nodePortalState.getAllPortals().forEach(({portal,nodePath}) => nodePortalResizeObserver.registerNodePortal(portal, NodeViewEventHandler.portalResizeEventCallback(nodeElement,portal,nodePath)));
    }

    private async deleteNodeView(event:RuntimeEventInstance<ReplaceViewEventMessage>,config:NodeViewConfig<any>) {
        const {nodeElement} = event.message.nodeEvent
        await config.destroyNodeView(event.message.nodeEvent)
        Maybe.fromNullable(this.mediator.getNodePortalStateHandler().getNodePortalState(nodeElement))
            .chainNullable(portalState => {
                const portals = portalState.getAllPortals()
                portals.forEach(({portal}) => this.mediator.getNodePortalResizeObserver().unregisterNodePortal(portal))
                portalState.destroyAllPortals()
            })
    }

}