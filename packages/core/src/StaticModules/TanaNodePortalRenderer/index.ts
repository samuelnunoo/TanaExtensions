import {TanaNode} from "../TanaStateProvider/types/types";
import TanaStateProvider from "../TanaStateProvider";
import {Maybe} from "purify-ts";
import TanaCommandExecutor from "../TanaCommandExecutor";
import TanaNodeFinder from "../TanaNodeFinder";
import TanaNodeAttributeInspector from "../TanaNodeAttributeInspector";
import TanaDomNodeProvider from "../TanaDomNodeProvider";

const NODE_PORTAL_TEMPLATE_NAME = "node-portal-component"

export default class TanaNodePortalRenderer {

    public static addNodeReferenceToPortal(portalParentNode:TanaNode,contentNode:HTMLElement) {
        const contentNodeId = TanaDomNodeProvider.getIdFromElement(contentNode)
        if (!contentNodeId) return null 
        const portalContainer = this.getOrInsertPortalContainer(portalParentNode)
        portalContainer.lock()
        const portalNodePath = TanaDomNodeProvider.getNodePathFromNodeId(portalContainer.id,document)
        if (!portalNodePath) return null
       
       return Maybe.fromNullable(TanaStateProvider.getNodeWithId(contentNodeId).extractNullable())
                .map(nodeRef => {
                const fileNodePath = this.insertNodeToPortal(portalContainer,nodeRef)
                TanaCommandExecutor.expandAllOwnedChildren(portalNodePath)
                const refNodePath = [...portalNodePath,...fileNodePath]
                TanaCommandExecutor.expandTanaNodeFromNodePath(refNodePath)
                return refNodePath
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
        const portalNodePath = TanaDomNodeProvider.getNodePathFromNodeId(portalContainer.id,document)
        if (!portalNodePath) return null 
        const portalNodePathString = portalNodePath.map(n => n.id).join("|")
        const portalDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(portalNodePathString)
        if (!portalDomNode) return null

        const portalDomNodeMap:Map<string,HTMLElement> = new Map() 
        const portalFolders = portalContainer.children 

        for (const folder of portalFolders) {
            const portalFiles = folder.children 
            for (const file of portalFiles) {
                const contentNodePathString = [ ...portalNodePath,folder,file,file.firstChild].map(node => node.id).join("|")
                const contentNode = TanaDomNodeProvider.getContentNodeFromNodePath(contentNodePathString)
                portalDomNodeMap.set(contentNodePathString,contentNode)
            }
        }

        return portalDomNodeMap
    }

    private static hideNodePortal(portalNodePath:TanaNode[]) {
        const portalNodePathString = portalNodePath.map(n => n.id).join("|")
        const portalDomNode = TanaDomNodeProvider.getContentNodeFromNodePath(portalNodePathString)
        if (!portalDomNode) return 
        portalDomNode.style.visibility = "hidden"
        portalDomNode.style.position = "absolute"
        portalDomNode.style.top = "-5000px"
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



