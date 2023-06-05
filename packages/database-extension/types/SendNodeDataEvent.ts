import RuntimeEventStatic from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic";


export interface SendNodeDataMessage {
    nodeId:string
    content:object

}


export default new RuntimeEventStatic<SendNodeDataMessage>("SendNodeDataEvent")