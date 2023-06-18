import DBCollection from "../database/DBCollection";
import RuntimeEventStatic from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic";

export interface NodeGetMessage {
    nodeId:string
    collection:DBCollection<any>
}

export default new RuntimeEventStatic<NodeGetMessage>("GetNodeDataEvent")
