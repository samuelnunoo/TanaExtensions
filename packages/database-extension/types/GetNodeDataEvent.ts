import RuntimeEventStatic from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic";

export interface NodeGetMessage {
    nodeId:string
    collection:string  
}



export default new RuntimeEventStatic<NodeGetMessage>("GetNodeDataEvent")
