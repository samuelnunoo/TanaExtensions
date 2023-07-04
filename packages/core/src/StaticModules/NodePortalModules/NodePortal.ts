import TanaDomNodeProvider from "../TanaDomNodeProvider";
import { TanaNode } from "../TanaStateProvider/types/types";


export default class NodePortal {
    private id: string 
    private portalContainerNode: TanaNode 
    private portalContainerNodePath: TanaNode[]
    private nodePortalNodePath: TanaNode[]
    private portalContainerDomNode: HTMLElement
    private nodePortalDomNode: HTMLElement
    private nodeViewContainer:HTMLElement|null = null

    constructor(
        portalContainerNodePath:TanaNode[],
        portalContainerDomNode:HTMLElement,
        nodePortalDomNode:HTMLElement,
        nodePortalNodePath:TanaNode[]
        ) {
            this.portalContainerDomNode = portalContainerDomNode
            this.portalContainerNodePath = portalContainerNodePath
            this.nodePortalDomNode = nodePortalDomNode
            this.nodePortalNodePath = nodePortalNodePath
            this.portalContainerNode = portalContainerNodePath[portalContainerNodePath.length - 1]
            this.id = this.constructPortalId()
        }

    public getPortalContainerNodePath() {
        return this.portalContainerNodePath
    }

    public getPortalNodeViewContainer() {
        if (this.nodeViewContainer) return this.nodeViewContainer
        this.nodeViewContainer = TanaDomNodeProvider.getNodeViewContainerFromPortalContainer(this.portalContainerDomNode)!
        return this.nodeViewContainer
    }

    public getPortalId() {
        return this.id 
    }

    public getPortalContainerNode() {
        return this.portalContainerNode
    }

    public getPortalDomNode() {
        return this.nodePortalDomNode
    }

    public getPortalContainerDomNode() {
        return this.portalContainerDomNode
    }

    public getPortalNodePath() {
        return this.nodePortalNodePath
    }

    public resetPortal() {
        //@ts-ignore 
        this.nodePortalDomNode.style = ""
    }
    
    private constructPortalId() {
        let portalTanaNodeIndex = this.getPortalContainerIndexInPortalPath()
        if (portalTanaNodeIndex == -1) throw Error(`Could not construct portalId for nodePath ${this.nodePortalNodePath}`)
        return this.nodePortalNodePath
            .filter((_,index) => index >= portalTanaNodeIndex)
            .map(node => node.id)
            .join("|")
    }

    private getPortalContainerIndexInPortalPath() {
        for (let i = 0; i < this.nodePortalNodePath.length; i++) {
            const node = this.nodePortalNodePath[i]
            if (node === this.portalContainerNode) {
                return i 
           
            }
        }
        return -1 
    }

}   