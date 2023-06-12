import TanaPubSubModule, {
    TanaPubSubComponent
} from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import OnDatabaseInitEvent from "../types/OnDatabaseInitEvent";
import IndexedDBSyncSubscriber from "./IndexedDBSyncSubscriber";
import {Maybe} from "purify-ts";
import {
    LatestTransactionMetadata,
    METADATA_DB_COLLECTION, TransactionMetaDataEnum
} from "../types/databaseTypes";
import DatabaseStateHandler from "./DatabaseStateHandler";

export default class TanaDatabaseExtension extends TanaPubSubModule {
    updateLatestTransactionId(arg0: any) {
        throw new Error("Method not implemented.");
    }
    private IndexedDBSyncSubscriber = new IndexedDBSyncSubscriber(this,this.eventBus)
    dbInstance:DatabaseStateHandler|null = null
    Maybe: any;

    getEventModuleInvokesOnCompletion(): InitEvent {
        return OnDatabaseInitEvent;
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.IndexedDBSyncSubscriber
        ];
    }



    getDBStateHandler() {
        return this.dbInstance
    }

    setDBStateHandler(db:DatabaseStateHandler) {
        this.dbInstance = db
    }


}