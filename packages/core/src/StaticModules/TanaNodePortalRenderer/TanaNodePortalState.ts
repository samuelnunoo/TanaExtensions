import TanaNodePortalRenderer from ".";
import TanaDomNodeProvider from "../TanaDomNodeProvider";
import { TanaNode } from "../TanaStateProvider/types/types";

export default class TanaNodePortalState {
    private portalParentNode:TanaNode 
    private portalMap:Map<string,HTMLElement>

    constructor(portalParentNode:TanaNode) {
        this.portalParentNode = portalParentNode
        TanaNodePortalRenderer.hidePortalAndExpandDescendants(portalParentNode)
        const portalMap = TanaNodePortalRenderer.getPortalDomNodes(this.portalParentNode)
        this.portalMap = !!portalMap ? portalMap : new Map() 
    }

    addContentNodeToPortal(contentNode:HTMLElement) {
        const nodePath = TanaNodePortalRenderer.addNodeReferenceToPortal(this.portalParentNode,contentNode)
        if (!nodePath) throw Error("Failed to add contentNode to NodePortal")
        
        const nodePathString = this.nodePathToString(nodePath)
        const contentDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(nodePathString)
        this.portalMap.set(nodePathString,contentDomNode)
        return {
            nodePath:nodePathString,
            contentDomNode
        }
    }

    getPortalNode(nodePath:string) {
        return this.portalMap.get(nodePath)
    }

    private nodePathToString(nodePath:TanaNode[]) {
        return nodePath.map(node => node.id).join("|")
    }

}