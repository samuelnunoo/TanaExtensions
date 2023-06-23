import TanaNodePortalState from "../../StaticModules/TanaNodePortalRenderer/TanaNodePortalState";

export default class NodePortalStateHandler {
    private nodePortalStateMap: Map<HTMLElement,TanaNodePortalState> = new Map() 

    addNodePortalState(nodeViewContainer:HTMLElement,nodePortalState:TanaNodePortalState) {
        this.nodePortalStateMap.set(nodeViewContainer,nodePortalState)
    }
    
    getNodePortalState(nodeViewContainer:HTMLElement) {
        return this.nodePortalStateMap.get(nodeViewContainer)
    }

    deleteNodePortalState(nodeViewContainer:HTMLElement) {
        this.nodePortalStateMap.delete(nodeViewContainer)
    }


}