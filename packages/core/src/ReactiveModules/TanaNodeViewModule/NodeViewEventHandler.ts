import NodePortalResizeContent from "../../StaticModules/NodePortalModule/NodePortalResizeObserver/types/NodePortalResizeContent"
import TanaNodePortalState from "../../StaticModules/NodePortalModule/TanaNodePortalRenderer/TanaNodePortalState"
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance"
import { DropEventContent } from "../TanaDragDropModule/types/OnDropEvent"
import NodeViewEvents from "./types/configs/NodeViewEvents"
import ExpandedDropEventContent from "./types/events/ExpandedDropEventContent"

const ON_DROP_DOM_EVENT = "onDropEvent"
const ON_RESIZE_DOM_EVENT = "onNodePortalResizeEvent"

export default class NodeViewEventHandler {

   public static getEventHandlers(nodeElement:HTMLElement) {
        return {
            addOnDropEventListener(callback:(event:CustomEvent<ExpandedDropEventContent>) => void) {
                nodeElement.addEventListener(ON_DROP_DOM_EVENT,callback as EventListener)
            },
            removeOnDropEventListener(callback:(event:CustomEvent<ExpandedDropEventContent>) => void) {
                nodeElement.removeEventListener(ON_DROP_DOM_EVENT,callback as EventListener)
            },
            addNodePortalResizeListener(callback:(event:CustomEvent<NodePortalResizeContent>) => void) {
                nodeElement.addEventListener(ON_RESIZE_DOM_EVENT,callback as EventListener)
            },
            removeNodePortalResizeListener(callback:(event:CustomEvent<NodePortalResizeContent>) => void) {
                nodeElement.removeEventListener(ON_RESIZE_DOM_EVENT,callback as EventListener)
            }
            
        } as NodeViewEvents
    }

    public static invokeDropEvent(event:RuntimeEventInstance<DropEventContent>,portalStateHandler:TanaNodePortalState,contentDomNode:HTMLElement,nodePath:string) {
        const {nodeElement} = event.message
        const dropDomEvent = new CustomEvent<ExpandedDropEventContent>(ON_DROP_DOM_EVENT,{
            detail:{
                ...event.message,
                portalStateHandler,
                contentDomNode,
                nodePath
            },
            bubbles:true 
        })

        nodeElement.dispatchEvent(dropDomEvent)
    }

    public static portalResizeEventCallback(nodeElement:HTMLElement,portalNode:HTMLElement,nodePath:string) {
        return  (entries: ResizeObserverEntry[]) => {
                const event = new CustomEvent<NodePortalResizeContent>(ON_RESIZE_DOM_EVENT,{
                    detail: {
                        portalResizeData:entries,
                        portalNode,
                        nodePath
                    }
                })
                nodeElement.dispatchEvent(event)
        }
    }
}