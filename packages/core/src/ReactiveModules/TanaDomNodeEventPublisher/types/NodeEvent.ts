import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic";
import {NodeEventTypeEnum} from "./types";
import {TanaNode} from "../../../StaticModules/TanaStateProvider/types/types";
import {NodeViewType} from "../../TanaNodeViewPublisher/types/configs/NodeViewType";



export enum NodeElementType {
        BulletAndContent = "bulletAndContent",
        WrapEditableAndMenu = "wrapEditableAndMenu"
}
export interface NodeEventMessage {
        nodeElement: HTMLElement
        tanaNode:TanaNode
        nodeViewType:NodeViewType
        nodeId:string
        nodeEventType:NodeEventTypeEnum
        panel:HTMLElement
        isHeaderNode:boolean
        nodeType: NodeElementType
}



export default new RuntimeEventStatic<NodeEventMessage>("nodeEvent")



