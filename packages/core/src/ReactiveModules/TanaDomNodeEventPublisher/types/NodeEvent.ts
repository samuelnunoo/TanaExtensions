import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic";
import {NodeEventTypeEnum} from "./types";
import {TanaNode} from "../../TanaStateProvider/types/types";


export interface NodeEventMessage {
        nodeElement: HTMLElement
        tanaNode:TanaNode
        nodeId:string
        nodeEventType:NodeEventTypeEnum
        panel:HTMLElement
        isHeaderNode:boolean
}



export default new RuntimeEventStatic<NodeEventMessage>("nodeEvent")



