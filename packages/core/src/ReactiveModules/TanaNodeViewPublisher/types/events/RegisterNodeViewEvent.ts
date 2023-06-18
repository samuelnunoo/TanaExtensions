import RuntimeEventStatic from "../../../EventBus/types/RuntimeEventStatic";
import NodeViewConfig from "../configs/NodeViewConfig";


export interface RegisterNodeViewMessage {
    templateId:string
    config: NodeViewConfig<any>
}


export default new RuntimeEventStatic<RegisterNodeViewMessage>("registerNodeViewEvent")