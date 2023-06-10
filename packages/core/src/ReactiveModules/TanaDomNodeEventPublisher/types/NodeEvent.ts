import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic";
import {NodeEventTypeEnum} from "./types";
import {TanaNode} from "../../../StaticModules/TanaStateProvider/types/types";



export enum NodeElementType {
        BulletAndContent = "bulletAndContent",
        WrapEditableAndMenu = "wrapEditableAndMenu"
}
export interface NodeEventMessage {
        nodeElement: HTMLElement
        tanaNode:TanaNode
        nodeId:string
        nodeEventType:NodeEventTypeEnum
        panel:HTMLElement
        isHeaderNode:boolean
        nodeType: NodeElementType
}



export default new RuntimeEventStatic<NodeEventMessage>("nodeEvent")



