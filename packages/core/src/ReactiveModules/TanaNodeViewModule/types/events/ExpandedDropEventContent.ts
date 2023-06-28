import TanaNodePortalState from "../../../../StaticModules/NodePortalModule/TanaNodePortalRenderer/TanaNodePortalState";
import { DropEventContent } from "../../../TanaDragDropModule/types/OnDropEvent";




export default interface ExpandedDropEventContent extends DropEventContent {
    portalStateHandler: TanaNodePortalState 
    contentDomNode: HTMLElement
    nodePath:string 
}