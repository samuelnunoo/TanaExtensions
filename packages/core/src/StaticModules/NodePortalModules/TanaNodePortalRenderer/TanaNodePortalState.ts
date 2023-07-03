import { Maybe } from "purify-ts";
import TanaNodePortalRenderer from ".";
import INodePortalListener from "../../../ReactiveModules/TanaNodeViewModule/types/INodePortalListener";
import { TanaNode } from "../../TanaStateProvider/types/types";
import NodePortal from "../NodePortal";

export default class TanaNodePortalState {
    private portalParentNode:TanaNode 
    private portalMap:Map<string,NodePortal>
    private listener:INodePortalListener

    constructor(portalParentNode:TanaNode,listener:INodePortalListener) {
        this.portalParentNode = portalParentNode
        TanaNodePortalRenderer.hidePortalAndExpandDescendants(portalParentNode)
        const portalMap = TanaNodePortalRenderer.getPortalDomNodes(this.portalParentNode)
        this.portalMap = !!portalMap ? portalMap : new Map() 
        this.listener = listener
        this.portalMap.forEach(portal => this.listener.onPortalPresenceChange(portal,false))
    }

    addContentNodeToPortal(contentNode:HTMLElement,expandPortal:boolean) {
        const nodePortal = TanaNodePortalRenderer.addNodeReferenceToPortal(this.portalParentNode,contentNode,expandPortal)
        if (!nodePortal) throw Error("Failed to add contentNode as NodePortal")
        
        this.portalMap.set(nodePortal.getPortalId(),nodePortal)
        this.listener.onPortalPresenceChange(nodePortal,false)
        return nodePortal
    }


    getNodePortal(portalId:string) {
        return this.portalMap.get(portalId)
    }

    runCommandOnPortals(commandToExecute:(portal:NodePortal,portalId:string) => void) {
        this.portalMap.forEach(commandToExecute)
    }

    resetAllPortals() {
        this.portalMap.forEach(portal => {
            this.listener.onPortalPresenceChange(portal,true)
            portal.resetPortal()
            //@ts-ignore 
            portal.getPortalContainerDomNode().style = ""
        })
        this.portalMap = new Map() 
    }

    destroyPortalFromPortalId(portalId:string) {
        Maybe.fromNullable(this.portalMap.get(portalId))
        .chainNullable(portal => {
            this.listener.onPortalPresenceChange(portal,true)
            portal.resetPortal() 
        })
    }

    destroyPortalFromDomNode(portal:NodePortal) {
        this.listener.onPortalPresenceChange(portal,true)
        portal.resetPortal()
    }

    getAllPortals() {
        const portals:{portal:NodePortal,nodePath:string}[] = []
        this.portalMap.forEach((portal,nodePath) => {portals.push({portal,nodePath})})
        return portals 
    }

}