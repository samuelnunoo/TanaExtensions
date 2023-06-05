
import RuntimeEventStatic from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic";


export interface UpdateNodeDataEventMessage {
    nodeId:string

    content:object

    isDelete:boolean
}

export default new RuntimeEventStatic<UpdateNodeDataEventMessage>("updateNodeDataEvent")