import RuntimeEventStatic from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic";

export interface NodeGetMessage {
    nodeId:string
}



export default new RuntimeEventStatic<NodeGetMessage>("GetNodeDataEvent")
