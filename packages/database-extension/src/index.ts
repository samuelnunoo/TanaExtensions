import TanaPubSubModule, {
    TanaPubSubComponent
} from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import OnDatabaseInitEvent from "../types/events/OnDatabaseInitEvent";
import IndexedDBSyncSubscriber from "./IndexedDBSyncSubscriber";
import DatabaseStateHandler from "./DatabaseStateHandler";

export default class TanaDatabaseExtension extends TanaPubSubModule {
    updateLatestTransactionId(arg0: any) {
        throw new Error("Method not implemented.");
    }

    private IndexedDBSyncSubscriber = new IndexedDBSyncSubscriber(this,this.eventBus)
    private dbInstance:DatabaseStateHandler|null = null

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