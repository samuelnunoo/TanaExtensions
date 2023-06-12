import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic";
import NodeViewConfig from "./INodeView";


export interface RegisterNodeViewMessage {
    templateId:string 
    config: NodeViewConfig
}


export default new RuntimeEventStatic<RegisterNodeViewMessage>("registerNodeViewEvent")