
import RuntimeEventStatic from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic";
import DBCollectionEntry from "../database/DBCollectionEntry";
import DBCollection from "../database/DBCollection";


export interface UpdateNodeDataEventMessage<T> {
    nodeId:string
    dbCollection:DBCollection<T>
    content:T
}

export default new RuntimeEventStatic<UpdateNodeDataEventMessage<any>>("updateNodeDataEvent")