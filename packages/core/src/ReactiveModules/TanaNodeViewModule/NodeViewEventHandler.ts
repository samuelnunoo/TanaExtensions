import NodePortal from "../../StaticModules/NodePortalModules/NodePortal"
import NodePortalResizeContent from "../../StaticModules/NodePortalModules/NodePortalResizeObserver/types/NodePortalResizeContent"
import TanaNodePortalState from "../../StaticModules/NodePortalModules/TanaNodePortalRenderer/TanaNodePortalState"
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

    public static invokeDropEvent(event:RuntimeEventInstance<DropEventContent>,portalStateHandler:TanaNodePortalState,nodePortal:NodePortal) {
        const {nodeElement} = event.message
        const dropDomEvent = new CustomEvent<ExpandedDropEventContent>(ON_DROP_DOM_EVENT,{
            detail:{
                ...event.message,
                portalStateHandler,
                nodePortal
            },
            bubbles:true 
        })

        nodeElement.dispatchEvent(dropDomEvent)
    }

    public static portalResizeEventCallback(nodeElement:HTMLElement,nodePortal:NodePortal) {
        return  (entries: ResizeObserverEntry[]) => {
                const event = new CustomEvent<NodePortalResizeContent>(ON_RESIZE_DOM_EVENT,{
                    detail: {
                        portalResizeData:entries,
                        nodePortal
                    }
                })
                nodeElement.dispatchEvent(event)
        }
    }
}