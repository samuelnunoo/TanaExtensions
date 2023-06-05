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
import {DB_NAME, DBNode, METADATA_DB_COLLECTION, NODE_DB_COLLECTION} from "../types/databaseTypes";


export default class IndexedDBSyncSubscriber extends TanaSubscriber<TanaDatabaseExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnStartEvent
        ];
    }

    handleUpdateNodeDataEvent(event:RuntimeEventInstance<UpdateNodeDataEventMessage>) {
        const shouldInsert = event.message.isDelete == false
        const {nodeId,isDelete,content} = event.message
        const transaction_id = this.mediator.getLatestTransactionId()
        Maybe.fromNullable(this.mediator.dbInstance)
            .map(db => db.getCollection(NODE_DB_COLLECTION))
            .map(nodeDB =>
                shouldInsert ? nodeDB.insert({nodeId,isDelete,content, transactionId: transaction_id + 1} as DBNode)
                    : nodeDB.remove(nodeDB.findOne({nodeId}))
            )
        this.mediator.updateLatestTransactionId(transaction_id + 1)
    }

    onDependenciesInitComplete() {
        const db = new lokijs(DB_NAME,{
            adapter : new indexedDBAdapter(DB_NAME),
            autoload: true,
            autoloadCallback : databaseInitialize,
            autosave: true,
            autosaveInterval: 4000
        })
        function databaseInitialize() {
            console.log("Tana Local Database Initialized...")
            if (!db.getCollection(NODE_DB_COLLECTION)) {
                db.addCollection(NODE_DB_COLLECTION);
            }

            if (!db.getCollection(METADATA_DB_COLLECTION)) {
                db.addCollection(METADATA_DB_COLLECTION)
            }
            this.mediator.setDBInstance(db)
            this.subscribeToRuntimeEvent(UpdateNodeDataEvent,this.handleUpdateNodeDataEvent.bind(this))
        }


    }

}