import DefaultNodeConfig from "./DefaultNodeConfig";
import ExpandedNodeConfig from "./ExpandedNodeConfig";
import FullscreenNodeConfig from "./FullscreenNodeConfig";
import {NodeEventMessage} from "../../../TanaDomNodeEventPublisher/types/NodeEvent";
import TanaModuleComponent from "../../../EventBus/types/TanaModuleComponent";
import { DropEventContent } from "../../../TanaDragEventPublisher/types/OnDropEvent";
import TanaNodePortalState from "../../../../StaticModules/TanaNodePortalRenderer/TanaNodePortalState";  
import RuntimeEventInstance from 'tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance';

export default abstract class NodeViewConfig<T> extends TanaModuleComponent<T> {
    abstract OnDropEvent(dropEvent:RuntimeEventInstance<DropEventContent>,nodePortalState:TanaNodePortalState,addedDomContentNode:HTMLElement,dispatchDropDomEvent:() => void):void
    abstract createNodeView(nodeEvent:NodeEventMessage,nodePortalState:TanaNodePortalState): Promise<HTMLDivElement>
    abstract destroyNodeView(nodeEvent:NodeEventMessage): Promise<void>
    abstract setDimensions(nodeView:HTMLElement,width:string,height:string): void 
    abstract defaultConfig(): DefaultNodeConfig
    abstract expandedConfig(): ExpandedNodeConfig
    abstract fullScreenConfig(): FullscreenNodeConfig
}
