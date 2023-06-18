import {TanaNode} from "../TanaStateProvider/types/types";
import TanaStateProvider from "../TanaStateProvider";
import {Maybe} from "purify-ts";


export default class TanaCommandExecutor {

    public static addTemplateToNode(node:TanaNode,templateNode:TanaNode) {
        node.addTemplate(templateNode)
        node.runInitializations()
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

    public static expandTanaNode(tanaNode:TanaNode) {

    }
    public static insertNodeToTarget(targetNode:TanaNode,nodeToInsert:TanaNode) {
        
    }
}