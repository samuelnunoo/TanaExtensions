import DefaultNodeConfig from "./DefaultNodeConfig";
import ExpandedNodeConfig from "./ExpandedNodeConfig";
import FullscreenNodeConfig from "./FullscreenNodeConfig";
import {NodeEventMessage} from "../../../TanaDomNodeEventPublisher/types/NodeEvent";
import TanaModuleComponent from "../../../EventBus/types/TanaModuleComponent";

export default abstract class NodeViewConfig<T> extends TanaModuleComponent<T> {
    abstract createNodeView(nodeEvent:NodeEventMessage): Promise<HTMLDivElement>
    abstract destroyNodeView(nodeEvent:NodeEventMessage): Promise<void>
    abstract setDimensions(nodeView:HTMLElement,width:string,height:string): void 
    abstract defaultConfig(): DefaultNodeConfig
    abstract expandedConfig(): ExpandedNodeConfig
    abstract fullScreenConfig(): FullscreenNodeConfig
}
