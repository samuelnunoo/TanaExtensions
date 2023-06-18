import OnDatabaseInitEvent from "database-extension/types/events/OnDatabaseInitEvent";
import { InitEvent } from "../EventBus/types/Event";
import TanaPublisher from "../EventBus/types/TanaPublisher";
import TanaNodeViewModule from './index';
import CreateCollectionEvent from "database-extension/types/events/CreateCollectionEvent"
import NodeViewCollection from "./types/database/NodeViewCollection";




export default class NodeViewCollectionPublisher extends TanaPublisher<TanaNodeViewModule> {
    getInitRequirements(): InitEvent[] {
       return [
        OnDatabaseInitEvent
       ]
    }
    onDependenciesInitComplete() {
        const event = CreateCollectionEvent.createInstance({collection:NodeViewCollection})
       this.dispatchRuntimeEvent(event)
    }


}