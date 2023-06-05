import TanaPubSubModule, {
    TanaPubSubComponent
} from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import OnDatabaseInitEvent from "../types/OnDatabaseInitEvent";
import IndexedDBSyncSubscriber from "./IndexedDBSyncSubscriber";
import {identity, Maybe} from "purify-ts";
import {
    INDEXED_DB_LATEST_TRANSACTION_DB_ID,
    LatestTransactionMetadata,
    METADATA_DB_COLLECTION, TransactionMetaDataEnum
} from "../types/databaseTypes";

export default class TanaDatabaseExtension extends TanaPubSubModule {
    private IndexedDBSyncSubscriber = new IndexedDBSyncSubscriber(this,this.eventBus)
    dbInstance:LokiConstructor|null

    getEventModuleInvokesOnCompletion(): InitEvent {
        return OnDatabaseInitEvent;
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.IndexedDBSyncSubscriber
        ];
    }

    updateLatestTransactionId(latest_transaction_id:number) {
        Maybe.fromNullable(this.dbInstance)
            .map(db => db.getCollection(METADATA_DB_COLLECTION))
            .map(metadataCollection => {
                const entry = metadataCollection.findOne({type:TransactionMetaDataEnum.localDB}) ||
                    metadataCollection.insert({ type:TransactionMetaDataEnum.localDB } as LatestTransactionMetadata)
                entry.latest_transaction_id = latest_transaction_id
                metadataCollection.update(entry)
            })
    }

    getLatestTransactionId() {
        return Maybe.fromNullable(this.dbInstance)
            .map(db => db.getCollection(METADATA_DB_COLLECTION))
            .map(metadataCollection => metadataCollection.findOne({type:TransactionMetaDataEnum.localDB}))
            .map((transactionMetaData:LatestTransactionMetadata) =>  transactionMetaData.latest_transaction_id)
            .orDefault(0)
    }

    setDBInstance(db:LokiConstructor) {
        this.dbInstance = db
    }


}