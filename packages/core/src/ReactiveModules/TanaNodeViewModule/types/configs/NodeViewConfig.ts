import DefaultNodeConfig from "./DefaultNodeConfig";
import ExpandedNodeConfig from "./ExpandedNodeConfig";
import FullscreenNodeConfig from "./FullscreenNodeConfig";
import {NodeEventMessage} from "../../../TanaNodeEventModule/types/NodeEvent";
import TanaModuleComponent from "../../../EventBus/types/TanaModuleComponent";
import TanaNodePortalState from "../../../../StaticModules/NodePortalModule/TanaNodePortalRenderer/TanaNodePortalState";  
import ExpandedDropEventContent from "../events/ExpandedDropEventContent";
import NodeViewEvents from "./NodeViewEvents";

export default abstract class NodeViewConfig<T> extends TanaModuleComponent<T> {
    abstract templateName():string 
    abstract createNodeView(nodeEvent:NodeEventMessage,nodePortalState:TanaNodePortalState,eventHandlers:NodeViewEvents): Promise<HTMLDivElement>
    abstract destroyNodeView(nodeEvent:NodeEventMessage): Promise<void>
    abstract setDimensions(nodeView:HTMLElement,width:string,height:string): void 
    abstract defaultConfig(): DefaultNodeConfig
    abstract expandedConfig(): ExpandedNodeConfig
    abstract fullScreenConfig(): FullscreenNodeConfig
}
