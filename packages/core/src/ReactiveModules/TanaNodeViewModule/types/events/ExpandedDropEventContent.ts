import NodePortal from "../../../../StaticModules/NodePortalModules/NodePortal";
import TanaNodePortalState from "../../../../StaticModules/NodePortalModules/TanaNodePortalRenderer/TanaNodePortalState";
import { DropEventContent } from "../../../TanaDragDropModule/types/OnDropEvent";




export default interface ExpandedDropEventContent extends DropEventContent {
    portalStateHandler: TanaNodePortalState 
    nodePortal:NodePortal
}