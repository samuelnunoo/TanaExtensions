import {TanaNode} from "../TanaStateProvider/types/types";
import TanaStateProvider from "../TanaStateProvider";
import {Maybe} from "purify-ts";
import TanaDomNodeProvider from "../TanaDomNodeProvider";

export default class TanaCommandExecutor {

    public static addTemplateToNode(node:TanaNode,templateNode:TanaNode) {
        node.addTemplate(templateNode)
        node.runInitialisations()
    }

    public static turnNodeIntoCodeBlock(node:TanaNode) {
        node.insertTuple(node.nodeSpace.systemNodes.codeBlockLangAttr,"plaintext")
        node.docType = "codeblock"
    }

    public static createTemplateWithName(workspaceDescendant:TanaNode,templateName:string) {
            const schemaNode = workspaceDescendant.parentFile.getOrCreateSchemaNode()
            const template = schemaNode.insertNewNodeAtEnd()
            template.isTemplate = true
            template.name = templateName
            Maybe.fromNullable(template.metaNode?.getOrCreateTupleByAttributeId("SYS_A11"))
                .map(tupleValue => {
                    tupleValue.name = TanaStateProvider.getRandomColorId()
                })
            return template
    }

    public static expandTanaNodeFromContentNode(contentNode:HTMLElement) {
        const nodePath = TanaDomNodeProvider.getNodePathFromContentNode(contentNode)
        if (!nodePath) return 

        TanaStateProvider.getAppState()
            .chainNullable(appState => appState.getPanelUIStateForPath(nodePath))
            .chainNullable(panelUIState => panelUIState.expand(nodePath))
    }

    public static expandTanaNodeFromNodePath(nodePath:TanaNode[]) {
        TanaStateProvider.getAppState()
            .chainNullable(appState => appState.getPanelUIStateForPath(nodePath))
            .chainNullable(panelUIState => panelUIState.expand(nodePath))
    }

    public static collapseTanaNodeFromNodePath(nodePath:TanaNode[]) {
        TanaStateProvider.getAppState()
            .chainNullable(appState => appState.getPanelUIStateForPath(nodePath))
            .chainNullable(panelUIState => panelUIState.collapse(nodePath))
    }

    public static expandAllOwnedChildren(nodePath:TanaNode[]) {
        TanaStateProvider.getAppState()
            .chainNullable(appState => appState.getPanelUIStateForPath(nodePath))
            .chainNullable(panelUIState => panelUIState.expandAll(nodePath,false))
    }

    public static insertNodeToTarget(targetNode:TanaNode,nodeToInsert:TanaNode) {
        
    }
}