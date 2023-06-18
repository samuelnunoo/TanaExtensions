import {TanaNode} from "../TanaStateProvider/types/types";
import TanaStateProvider from "../TanaStateProvider";
import {Maybe} from "purify-ts";
import TanaCommandExecutor from "../TanaCommandExecutor";
import TanaNodeFinder from "../TanaNodeFinder";
import TanaNodeAttributeInspector from "../TanaNodeAttributeInspector";

const NODE_PORTAL_TEMPLATE_NAME = "node-portal-component"

export default class TanaNodePortalRenderer {
    public static addNodeReferenceToPortal(node:TanaNode,nodeRefId:string) {
        const nodeRef = TanaStateProvider.getNodeWithId(nodeRefId).extractNullable()
        if (!nodeRef) return null
        const portalContainer = this.getOrInsertPortalContainer(node)
        if (this.portalHasNode(portalContainer,nodeRefId)) return null
        return Maybe.fromNullable(TanaStateProvider.getNodeWithId(nodeRefId).extractNullable())
                .map(nodeRef => {
                portalContainer.addChild(nodeRef)
                TanaCommandExecutor.expandTanaNode(nodeRef)
                return nodeRef
            }).extractNullable()
    }

    private static portalHasNode(portal:TanaNode,nodeRefId:string) {
        for (const child of portal.children) {
            if (child.id == nodeRefId) return true
        }
        return false
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
            if (TanaNodeAttributeInspector.hasTemplateWithName(node,NODE_PORTAL_TEMPLATE_NAME)) return child
        }
        return null
    }

    private static getOrCreateTemplate(workspaceDescendant:TanaNode) {
        const template = TanaNodeFinder.getTemplateNodeWithName(NODE_PORTAL_TEMPLATE_NAME).extractNullable()
        if (template) return template
        return TanaCommandExecutor.createTemplateWithName(workspaceDescendant,NODE_PORTAL_TEMPLATE_NAME)
    }

}



