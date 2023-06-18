import TanaViewReplacementPublisher from ".";
import { InitEvent } from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import RegisterNodeViewEvent, { RegisterNodeViewMessage } from "./types/events/RegisterNodeViewEvent";
import OnDatabaseInitEvent from "database-extension/types/events/OnDatabaseInitEvent";
import SendNodeDataEvent from "database-extension/types/events/SendNodeDataEvent";
import NodeViewCollection from "./types/database/NodeViewCollection";
import ReplaceViewEvent, {ReplaceViewEventMessage} from "./types/events/ReplaceViewEvent";
import TanaNodeViewCreator from "../../StaticModules/TanaNodeViewCreator";
import {Maybe} from "purify-ts";


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
        Maybe.fromNullable(stateHandler.getEntry(event.message.nodeEvent.nodeId))
            .map(nodeViewConfig => {
                const {nodeElement,tanaNode,nodeViewType} = event.message.nodeEvent
                const nodeView = nodeViewConfig.createNodeView(event.message.nodeEvent)
                TanaNodeViewCreator.renderNodeView(
                    nodeView,tanaNode,nodeElement,nodeViewConfig,nodeViewType
                )
            })
    }

    async onRegisterNodeView({message}:RuntimeEventInstance<RegisterNodeViewMessage>) {
        const {templateId,config} = message
        const nodeViewEntry = NodeViewCollection.createInstance(templateId,{config})
        const dataRequestEvent = SendNodeDataEvent.createInstance({dbEntry:nodeViewEntry})
        const response = await this.dispatchEventAndAWaitFirstReply(dataRequestEvent,3)
        const configData = response ? {...config,...response} : config
        this.mediator.getNodeViewStateHandler().addEntry(templateId,configData)
    }

}