import DefaultNodeConfig from "./DefaultNodeConfig";
import ExpandedNodeConfig from "./ExpandedNodeConfig";
import FullscreenNodeConfig from "./FullscreenNodeConfig";
import {NodeEventMessage} from "../../../TanaDomNodeEventPublisher/types/NodeEvent";
import TanaModuleComponent from "../../../EventBus/types/TanaModuleComponent";
import { DropEventContent } from "../../../TanaDragEventPublisher/types/OnDragEvent";

export default abstract class NodeViewConfig<T> extends TanaModuleComponent<T> {
    abstract OnDropEvent(viewContainer:HTMLElement, dropEvent:CustomEvent<DropEventContent>,tanaNodeId:string):void 
    abstract createNodeView(nodeEvent:NodeEventMessage): Promise<HTMLDivElement>
    abstract destroyNodeView(nodeEvent:NodeEventMessage): Promise<void>
    abstract setDimensions(nodeView:HTMLElement,width:string,height:string): void 
    abstract defaultConfig(): DefaultNodeConfig
    abstract expandedConfig(): ExpandedNodeConfig
    abstract fullScreenConfig(): FullscreenNodeConfig
}
