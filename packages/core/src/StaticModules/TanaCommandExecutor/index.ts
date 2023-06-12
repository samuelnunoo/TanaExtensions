import {TanaNode} from "../TanaStateProvider/types/types";


export default class TanaCommandExecutor {

    public static addTemplateToNode(node:TanaNode,templateNode:TanaNode) {
        node.addTemplate(templateNode)
        node.runInitializations()
    }

    public static turnNodeIntoCodeBlock(node:TanaNode) {
        node.insertTuple(node.nodeSpace.systemNodes.codeBlockLangAttr,"plaintext")
        node.docType = "codeblock"
    }

    public static createTemplateWithName(templateName:string) {

    }

    public static insertNodeToTarget(targetNode:TanaNode,nodeToInsert:TanaNode) {
        
    }
}