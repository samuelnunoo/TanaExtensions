import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber";
import TanaDatabaseExtension from "./index";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import OnStartEvent from "tana-extensions-core/src/ReactiveModules/TanaModuleLoader/types/OnStartEvent";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import UpdateNodeDataEvent, {UpdateNodeDataEventMessage} from "../types/UpdateNodeDataEvent";
import {Maybe} from "purify-ts";
import {
    DBNode, 
    NODE_DB_COLLECTION} from "../types/databaseTypes";
import GetNodeDataEvent, {NodeGetMessage} from "../types/GetNodeDataEvent";
import SendNodeDataEvent from "../types/SendNodeDataEvent";
import DatabaseStateHandler from "./DatabaseStateHandler";


export default class IndexedDBSyncSubscriber extends TanaSubscriber<TanaDatabaseExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnStartEvent
        ];
    }

    private handleUpdateNodeDataEvent(event:RuntimeEventInstance<UpdateNodeDataEventMessage>) {
        const shouldInsert = event.message.isDelete == false
        const {nodeId,isDelete,content} = event.message
        Maybe.fromNullable(this.mediator.getDBStateHandler())
            .map(dbStateHandler => {
                const transactionId = dbStateHandler.getLatestTransactionId()
                dbStateHandler.updateEntry()
            })

        
        const transactionId = dbStateHandler?.getLatestTransactionId()
        Maybe.fromNullable(this.mediator.getDBStateHandler())
            .map(db => db.getCollection(NODE_DB_COLLECTION))
            .map(nodeDB => {
                const node = nodeDB.findOne({nodeId})
                if (!!node) {
                    node.nodeId = nodeId
                    node.isDelete = isDelete
                    node.content = content
                    node.transactionId = transactionId + 1
                }
                const newNodeData = {nodeId, isDelete, content, transactionId: transactionId + 1} as DBNode
                shouldInsert ? !!node ? nodeDB.update(node) : nodeDB.insert(newNodeData) : node.delete({nodeId})
            })
        this.mediator.updateLatestTransactionId(transactionId + 1)
    }

    private handleNodeGetEvent(event:RuntimeEventInstance<NodeGetMessage>) {
            const {nodeId} = event.message
            Maybe.fromNullable(this.mediator.getDBStateHandler())
                .map(dbStateHandler => {
                    dbStateHandler.getEntry()
                })
            const message = SendNodeDataEvent.createInstance({nodeId,content})
            this.dispatchEventResponse(event,message)
    }

    onDependenciesInitComplete() {
        const dbStateHandler = new DatabaseStateHandler()
        dbStateHandler.init().then( _ => {
            this.mediator.setDBStateHandler(dbStateHandler)
            this.subscribeToRuntimeEvent(UpdateNodeDataEvent,this.handleUpdateNodeDataEvent.bind(this))
            this.subscribeToRuntimeEvent(GetNodeDataEvent,this.handleNodeGetEvent.bind(this))
            console.log("Tana Local Database Initialized...")
        })
    }

}