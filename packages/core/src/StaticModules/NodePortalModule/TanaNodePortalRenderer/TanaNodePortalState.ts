import { Maybe } from "purify-ts";
import TanaNodePortalRenderer from ".";
import INodePortalListener from "../../../ReactiveModules/TanaNodeViewModule/types/INodePortalListener";
import TanaDomNodeProvider from "../../TanaDomNodeProvider";
import { TanaNode } from "../../TanaStateProvider/types/types";

export default class TanaNodePortalState {
    private portalParentNode:TanaNode 
    private portalMap:Map<string,HTMLElement>
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
        const nodePath = TanaNodePortalRenderer.addNodeReferenceToPortal(this.portalParentNode,contentNode,expandPortal)
        if (!nodePath) throw Error("Failed to add contentNode to NodePortal")
        
        const nodePathString = this.nodePathToString(nodePath)
        const contentDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(nodePathString)
        this.portalMap.set(nodePathString,contentDomNode)
        this.listener.onPortalPresenceChange(contentDomNode,false)
        return {
            nodePath:nodePathString,
            contentDomNode
        }
    }

    getPortalNode(nodePath:string) {
        return this.portalMap.get(nodePath)
    }

    runCommandOnPortals(commandToExecute:(portal:HTMLElement,nodePath:string) => void) {
        this.portalMap.forEach(commandToExecute)
    }

    destroyAllPortals() {
        this.portalMap.forEach(portal => {
            this.listener.onPortalPresenceChange(portal,true)
            portal.remove()
        })
    }

    destroyPortalFromNodePath(nodePath:string) {
        Maybe.fromNullable(this.portalMap.get(nodePath))
        .chainNullable(portal => {
            this.listener.onPortalPresenceChange(portal,true)
            portal.remove() 
        })
    }

    destroyPortalFromDomNode(portal:HTMLElement) {
        this.listener.onPortalPresenceChange(portal,true)
        portal.remove()
    }

    getAllPortals() {
        const portals:{portal:HTMLElement,nodePath:string}[] = []
        this.portalMap.forEach((portal,nodePath) => {portals.push({portal,nodePath})})
        return portals 
    }

    private nodePathToString(nodePath:TanaNode[]) {
        return nodePath.map(node => node.id).join("|")
    }

}