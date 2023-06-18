import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber";
import TanaDatabaseExtension from "./index";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import OnStartEvent from "tana-extensions-core/src/ReactiveModules/TanaModuleLoader/types/OnStartEvent";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import UpdateNodeDataEvent, {UpdateNodeDataEventMessage} from "../types/events/UpdateNodeDataEvent";
import {Maybe} from "purify-ts";
import GetNodeDataEvent, {NodeGetMessage} from "../types/events/GetNodeDataEvent";
import SendNodeDataEvent from "../types/events/SendNodeDataEvent";
import DatabaseStateHandler from "./DatabaseStateHandler";
import DBCollectionEntry from "../types/database/DBCollectionEntry";
import CreateCollectionEvent, { CreateCollectionMessage } from '../types/events/CreateCollectionEvent';


export default class IndexedDBSyncSubscriber extends TanaSubscriber<TanaDatabaseExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnStartEvent
        ];
    }

    public handleUpdateNodeDataEvent(event:RuntimeEventInstance<UpdateNodeDataEventMessage<any>>) {
        const {nodeId,content,dbCollection} = event.message
        Maybe.fromNullable(this.mediator.getDBStateHandler())
            .map(dbStateHandler => {
                dbStateHandler.updateEntry(dbCollection,nodeId,content)
            })
    }

    public handleNodeGetEvent(event:RuntimeEventInstance<NodeGetMessage>) {
            const {nodeId, collection} = event.message
            const dbEntry:DBCollectionEntry<any> | null = Maybe.fromNullable(this.mediator.getDBStateHandler())
                .map(dbStateHandler => dbStateHandler.getEntry(collection,nodeId))
                .extractNullable()
            const message = SendNodeDataEvent.createInstance({dbEntry})
            this.dispatchEventResponse(event,message)
    }

    public handleCreateCollectionEvent(event:RuntimeEventInstance<CreateCollectionMessage>) {
        const {collection} = event.message 
        Maybe.fromNullable(this.mediator.getDBStateHandler())
        .map(dbStateHandler => dbStateHandler.createCollectionIfNotExists(collection))
    }

    async onDependenciesInitComplete() {
        const dbStateHandler = new DatabaseStateHandler()
        await dbStateHandler.init()
        this.mediator.setDBStateHandler(dbStateHandler)
        this.subscribeToRuntimeEvent(UpdateNodeDataEvent,this.handleUpdateNodeDataEvent.bind(this))
        this.subscribeToRuntimeEvent(GetNodeDataEvent,this.handleNodeGetEvent.bind(this))
        this.subscribeToRuntimeEvent(CreateCollectionEvent,this.handleCreateCollectionEvent.bind(this))
        console.log("Tana Local Database Initialized...")
    }

}