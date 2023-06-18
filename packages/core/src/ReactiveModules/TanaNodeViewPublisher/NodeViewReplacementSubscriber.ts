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
import { NodeEventTypeEnum } from "../TanaDomNodeEventPublisher/types/types";


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
                else if (isDeletionEvent) await nodeViewConfig.destroyNodeView(event.message.nodeEvent)
         
            })
    }

    private async createNodeView(event:RuntimeEventInstance<ReplaceViewEventMessage>,config:NodeViewConfig<any>) {
        const {nodeElement,tanaNode,nodeViewType} = event.message.nodeEvent
        const nodeView = await config.createNodeView(event.message.nodeEvent)
        TanaNodeViewCreator.renderNodeView(
            nodeView,tanaNode,nodeElement,config,nodeViewType
        )
    }


    async onRegisterNodeView({message}:RuntimeEventInstance<RegisterNodeViewMessage>) {
        const {templateId,config} = message
        const dataRequestEvent = GetNodeDataEvent.createInstance({collection:NodeViewCollection, nodeId:templateId})
        const response = await this.dispatchEventAndAWaitFirstReply(dataRequestEvent,3) as NodeViewConfig<any>
        const configData:NodeViewConfig<any> = response ? {...config,...response} as NodeViewConfig<any> : config
        this.mediator.getNodeViewStateHandler().addEntry(templateId,configData)
    }

}