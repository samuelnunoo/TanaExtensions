import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic";




export interface DropEventContent {
    tanaNodeId:string 
    targetElement:HTMLElement
    mouseEvent:MouseEvent
}





export const ON_DROP_EVENT = "onDropEvent"