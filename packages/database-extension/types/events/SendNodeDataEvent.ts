import RuntimeEventStatic from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic";
import DBCollectionEntry from "../database/DBCollectionEntry";


export interface SendNodeDataMessage<T>{
    dbEntry: DBCollectionEntry<T> | null
}


export default new RuntimeEventStatic<SendNodeDataMessage<any>>("SendNodeDataEvent")