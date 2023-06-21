import { TanaNode } from "../../../StaticModules/TanaStateProvider/types/types"
import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic"

export interface DropEventContent {
    draggedTanaNodeId:string 
    dropTarget:HTMLElement
    nodeViewTemplateId:string 
    targetTanaNode:TanaNode
    targetNodeViewContainer:HTMLElement
    draggedContentNode:HTMLElement
    mouseEvent:MouseEvent
}

export const ON_DROP_DOM_EVENT = "onDropEvent"


export default new RuntimeEventStatic<DropEventContent>("OnDropEvent")
