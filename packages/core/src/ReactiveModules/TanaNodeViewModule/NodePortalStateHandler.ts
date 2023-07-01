import NodePortal from "../../StaticModules/NodePortalModules/NodePortal";
import TanaNodePortalState from "../../StaticModules/NodePortalModules/TanaNodePortalRenderer/TanaNodePortalState";
import INodePortalListener from "./types/INodePortalListener";

export default class NodePortalStateHandler {
    private nodePortalStateMap: Map<HTMLElement,TanaNodePortalState> = new Map() 
    private listeners: INodePortalListener[] = []

    runCommandOnAllPortals(command:(portal:NodePortal,portalId:string) => void) {
        this.nodePortalStateMap.forEach(portalState => {
            portalState.runCommandOnPortals(command)
        })
    }

    addNodePortalState(nodeViewContainer:HTMLElement,nodePortalState:TanaNodePortalState) {
        this.nodePortalStateMap.set(nodeViewContainer,nodePortalState)
    }
    
    getNodePortalState(nodeViewContainer:HTMLElement) {
        return this.nodePortalStateMap.get(nodeViewContainer)
    }

    deleteNodePortalState(nodeViewContainer:HTMLElement) {
        this.nodePortalStateMap.delete(nodeViewContainer)
    }

    registerPortalListener(listener:INodePortalListener) {
        this.listeners.push(listener)
    }

    unregisterPortalListener(listener:INodePortalListener) {
        this.listeners = this.listeners.filter(l => l !== listener)
    }

    private notifyListeners(portal:NodePortal,isRemoval:boolean) {
        for (const listener of this.listeners) {
            listener.onPortalPresenceChange(portal,isRemoval)
        }
    }

}