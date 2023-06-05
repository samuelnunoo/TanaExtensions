import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber";
import TanaDatabaseExtension from "./index";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import  lokijs from "lokijs";

//@ts-ignore
import indexedDBAdapter from "lokijs/src/loki-indexed-adapter.js"
import OnStartEvent from "tana-extensions-core/src/ReactiveModules/TanaModuleLoader/types/OnStartEvent";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import UpdateNodeDataEvent, {UpdateNodeDataEventMessage} from "../types/UpdateNodeDataEvent";
import {Maybe} from "purify-ts";
import {
    DB_NAME,
    DBNode, LatestTransactionMetadata,
    METADATA_DB_COLLECTION,
    NODE_DB_COLLECTION,
    TransactionMetaDataEnum
} from "../types/databaseTypes";
import GetNodeDataEvent, {NodeGetMessage} from "../types/GetNodeDataEvent";
import SendNodeDataEvent from "../types/SendNodeDataEvent";


export default class IndexedDBSyncSubscriber extends TanaSubscriber<TanaDatabaseExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnStartEvent
        ];
    }

    private insertData() {

    }

    private handleUpdateNodeDataEvent(event:RuntimeEventInstance<UpdateNodeDataEventMessage>) {
        console.log("Handling updateNodeDataEvent ",event)
        const shouldInsert = event.message.isDelete == false
        const {nodeId,isDelete,content} = event.message
        const transactionId = this.mediator.getLatestTransactionId()
        Maybe.fromNullable(this.mediator.dbInstance)
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
            const content = Maybe.fromNullable(this.mediator.dbInstance)
                .map(db => db.getCollection(NODE_DB_COLLECTION))
                .map(nodeCollection => nodeCollection.findOne({nodeId}))
                .extract()

            const message = SendNodeDataEvent.createInstance({nodeId,content})
            this.dispatchEventResponse(event,message)
    }

    onDependenciesInitComplete() {
        const databaseInitialize = () => {
            if (!db.getCollection(NODE_DB_COLLECTION)) {
                db.addCollection(NODE_DB_COLLECTION);
            }

            if (!db.getCollection(METADATA_DB_COLLECTION)) {
                db.addCollection(METADATA_DB_COLLECTION)
                const metadata = db.getCollection(METADATA_DB_COLLECTION)
                metadata.insert({type:TransactionMetaDataEnum.localDB,latest_transaction_id:0} as LatestTransactionMetadata)
                metadata.insert({type:TransactionMetaDataEnum.remoteDB,latest_transaction_id:0 } as LatestTransactionMetadata)
            }
            this.mediator.setDBInstance(db)
            this.subscribeToRuntimeEvent(UpdateNodeDataEvent,this.handleUpdateNodeDataEvent.bind(this))
            this.subscribeToRuntimeEvent(GetNodeDataEvent,this.handleNodeGetEvent.bind(this))
            console.log("Tana Local Database Initialized...")
        }

        const db = new lokijs(DB_NAME,{
            adapter : new indexedDBAdapter(DB_NAME),
            autoload: true,
            autoloadCallback : databaseInitialize,
            autosave: true,
            autosaveInterval: 4000
        })


    }

}