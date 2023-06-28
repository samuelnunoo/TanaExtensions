import { TanaNode } from "../../../StaticModules/TanaStateProvider/types/types"
import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic"

export interface DropEventContent {
    draggedTanaNodeId:string 
    dropTarget:HTMLElement
    nodeViewTemplateId:string
    isExpanded:boolean 
    targetTanaNode:TanaNode
    targetNodeViewContainer:HTMLElement
    draggedContentNode:HTMLElement
    mouseEvent:MouseEvent
    nodeElement:HTMLElement
}

export const ON_DROP_DOM_EVENT = "onDropEvent"


export default new RuntimeEventStatic<DropEventContent>("OnDropEvent")
