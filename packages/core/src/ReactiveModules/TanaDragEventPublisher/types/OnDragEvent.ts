import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic";




export interface DragEventMessage {
    tanaNodeId:string 
    targetElement:HTMLElement
    event:MouseEvent
}





export default new RuntimeEventStatic<DragEventMessage>("OnDragEvent")