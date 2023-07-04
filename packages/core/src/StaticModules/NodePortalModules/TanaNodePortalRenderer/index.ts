import {TanaNode} from "../../TanaStateProvider/types/types";
import TanaStateProvider from "../../TanaStateProvider";
import {Maybe} from "purify-ts";
import TanaCommandExecutor from "../../TanaCommandExecutor";
import TanaNodeFinder from "../../TanaNodeFinder";
import TanaNodeAttributeInspector from "../../TanaNodeAttributeInspector";
import TanaDomNodeProvider from "../../TanaDomNodeProvider";
import NodePortal from "../NodePortal";

const NODE_PORTAL_TEMPLATE_NAME = "node-portal-component"
const NODE_PORTAL_CLASS = "node-portal-container"

export default class TanaNodePortalRenderer {

    public static addNodeReferenceToPortal(portalParentNode:TanaNode,contentNode:HTMLElement,expandPortal:boolean) {
        const contentNodeId = TanaDomNodeProvider.getIdFromElement(contentNode)
        if (!contentNodeId) return null 
        const portalContainer = this.getOrInsertPortalContainer(portalParentNode)
        portalContainer.lock()
        const portalContainerNodePath = TanaDomNodeProvider.getNodePathFromNodeId(portalContainer.id,document)
        if (!portalContainerNodePath) return null
       
       return Maybe.fromNullable(TanaStateProvider.getNodeWithId(contentNodeId).extractNullable())
                .map(nodePortal => {
                const fileNodePath = this.insertNodeToPortal(portalContainer,nodePortal)
                TanaCommandExecutor.expandAllOwnedChildren(portalContainerNodePath)
                const nodePortalNodePath = [...portalContainerNodePath,...fileNodePath]

                if (expandPortal) TanaCommandExecutor.expandTanaNodeFromNodePath(nodePortalNodePath)
                else TanaCommandExecutor.collapseTanaNodeFromNodePath(nodePortalNodePath)
                const nodePortalDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(nodePortalNodePath.map(node => node.id).join("|"))
                const portalContainerDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(portalContainerNodePath.map(node => node.id).join("|"))
                if (!nodePortalDomNode || !portalContainerDomNode) return null 
                this.removeCSSPositionFromNonPortalAncestors(nodePortalDomNode)
                this.hideNodePortal(portalContainerNodePath)
                    
                return new NodePortal(
                    portalContainerNodePath,
                    portalContainerDomNode,
                    nodePortalDomNode,
                    nodePortalNodePath
                )
           
            }).extractNullable()
    }

    public static hidePortalAndExpandDescendants(portalParentNode:TanaNode) {
        const portalContainer = this.getOrInsertPortalContainer(portalParentNode)
        const portalNodePath = TanaDomNodeProvider.getNodePathFromNodeId(portalContainer.id,document)
        if (!portalNodePath) return 
        this.hideNodePortal(portalNodePath)
        TanaCommandExecutor.expandAllOwnedChildren(portalNodePath)
    }

    public static getPortalDomNodes(portalParentNode:TanaNode) {
        const portalContainer = this.getOrInsertPortalContainer(portalParentNode)
        const portalContainerNodePath = TanaDomNodeProvider.getNodePathFromNodeId(portalContainer.id,document)
        if (!portalContainerNodePath) return null 
        const portalNodePathString = portalContainerNodePath.map(n => n.id).join("|")
        const portalContainerDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(portalNodePathString)
        if (!portalContainerDomNode) return null

        const portalDomNodeMap:Map<string,NodePortal> = new Map() 
        const portalFolders = portalContainer.children 

        for (const folder of portalFolders) {
            const portalFiles = folder.children 
            for (const file of portalFiles) {
                const portalNodePath = [ ...portalContainerNodePath,folder,file,file.firstChild]
                const portalNodePathString = portalNodePath.map(node => node.id).join("|")
                const portalDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(portalNodePathString)
                this.removeCSSPositionFromNonPortalAncestors(portalDomNode)
                
                const nodePortal = new NodePortal(
                    portalContainerNodePath,
                    portalContainerDomNode,
                    portalDomNode,
                    portalNodePath
                )
                portalDomNodeMap.set(nodePortal.getPortalId(),nodePortal)
            }
        }

        return portalDomNodeMap
    }

    private static removeCSSPositionFromNonPortalAncestors(contentNode:HTMLElement) {
        let current = contentNode.parentElement
        while (current && !current.classList.contains(NODE_PORTAL_CLASS)) {
            current.style.position = "static"
            current = current.parentElement
        }
    }

    private static hideNodePortal(portalNodePath:TanaNode[]) {
        const portalNodePathString = portalNodePath.map(n => n.id).join("|")
        const portalDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(portalNodePathString)
        if (!portalDomNode) return 
        //@ts-ignore 
        portalDomNode.style = ""
        portalDomNode.style.visibility = "hidden"
        portalDomNode.style.position = "absolute"
        portalDomNode.style.left = "1000px"
        portalDomNode.classList.add(NODE_PORTAL_CLASS)
    }
    
    private static insertNodeToPortal(portalContainer:TanaNode,node:TanaNode) {
        const folder = this.getOrCreateFolder(portalContainer,node)
        const file = this.addInstanceToFolder(folder,node)
        folder.lock()
        file.lock()
        return [folder,file,node]
    }

    private static addInstanceToFolder(folder:TanaNode,node:TanaNode) {
        const file = folder.insertNewNodeAtEnd()
        file.name = `${folder.children.length}`
        file.addChild(node)
        return file 
    }

    private static getOrCreateFolder(portalContainer:TanaNode,node:TanaNode) {
        const folder = this.getNodeFolder(portalContainer,node)
        if (folder) return folder 
        return this.createNodeFolder(portalContainer,node)
    }

    private static getNodeFolder(portalContainer:TanaNode,node:TanaNode) {
        for (const child of portalContainer.children) {
            if (child.name == node.id) return child 
        }
        return null 
    }

    private static createNodeFolder(portalContainer:TanaNode,node:TanaNode) {
        const folder = portalContainer.insertNewNodeAtEnd()
        folder.name = node.id 
        return folder 
    }

    private static getOrInsertPortalContainer(tanaNode:TanaNode) {
        const portalContainer = this.getPortalContainer(tanaNode)
        if (portalContainer) return portalContainer
        const template = this.getOrCreateTemplate(tanaNode)
        const newPortalContainer = tanaNode.insertNewNodeAtEnd()
        TanaCommandExecutor.addTemplateToNode(newPortalContainer,template)
        return newPortalContainer
    }

    private static getPortalContainer(node:TanaNode) {
        for (const child of node.children){
            if (TanaNodeAttributeInspector.hasTemplateWithName(child,NODE_PORTAL_TEMPLATE_NAME)) return child
        }
        return null
    }

    private static getOrCreateTemplate(workspaceDescendant:TanaNode) {
        const template = TanaNodeFinder.getTemplateNodeWithName(NODE_PORTAL_TEMPLATE_NAME).extractNullable()
        if (template) return template
        return TanaCommandExecutor.createTemplateWithName(workspaceDescendant,NODE_PORTAL_TEMPLATE_NAME)
    }

}



