import NodePortalResizeContent from "../../../../StaticModules/NodePortalModule/NodePortalResizeObserver/types/NodePortalResizeContent"
import ExpandedDropEventContent from "../events/ExpandedDropEventContent"




export default interface NodeViewEvents {
    addOnDropEventListener(callback:(event:CustomEvent<ExpandedDropEventContent>) => void): void 
    removeOnDropEventListener(callback:(event:CustomEvent<ExpandedDropEventContent>) => void): void 
    addNodePortalResizeListener(callback:(event:CustomEvent<NodePortalResizeContent>) => void): void 
    removeNodePortalResizeListener(callback:(event:CustomEvent<NodePortalResizeContent>) => void): void 
}