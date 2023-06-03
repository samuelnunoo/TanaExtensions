import {
    BULLET_CONTENT_CSS_CLASS,
    BULLET_MODULE_CLASS_PREFIX,
    CONTENT_SIDE_CSS_CLASS,
    EDITABLE_CSS_CLASS, EXPANDED_NODE_CSS_CLASS,
    NodeEventTypeEnum, NON_TEMPLATE_CSS_CLASS, PANEL_CONTENT_CSS_CLASS
} from "./types/types";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";


export default class MutationRecordAttributeInspector {

    private static classList:string[] = [
        CONTENT_SIDE_CSS_CLASS,
        EDITABLE_CSS_CLASS,
        BULLET_CONTENT_CSS_CLASS,
        EXPANDED_NODE_CSS_CLASS,
        PANEL_CONTENT_CSS_CLASS,
        NON_TEMPLATE_CSS_CLASS
    ]
    public static getMutationEventType(mutation:MutationRecord) {
        const removedNodes = Array.from(mutation.removedNodes) as HTMLElement[]
        const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[]
        const isRemoveEvent = !!TanaDomNodeProvider.getNodeWithClassFromArray(removedNodes,BULLET_CONTENT_CSS_CLASS)
        const isAddedEvent = !!TanaDomNodeProvider.getNodeWithClassFromArray(addedNodes,BULLET_CONTENT_CSS_CLASS)
        if (isAddedEvent && isRemoveEvent) throw new Error("Tana content node exists in both the remove and added nodes array.")
        if (isRemoveEvent) return NodeEventTypeEnum.Deletion
        if (isAddedEvent) return NodeEventTypeEnum.Insertion
        return NodeEventTypeEnum.Update
    }
    public static nodeHasClassPrefix(node:HTMLElement,classPrefix:string) {
        if (!node.hasOwnProperty('classList')) return false
        for (const classItem of Array.from(node.classList)) {
            if (!!classItem.match(classPrefix)) return true
        }
        return false
    }
    public static mutationRecordContainsBulletModule(mutation:MutationRecord) {
        const isRemoval = mutation.removedNodes.length > 0
        const node = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0] ) as HTMLElement
        return MutationRecordAttributeInspector.nodeHasClassPrefix(node,BULLET_MODULE_CLASS_PREFIX)
    }
    public static mutationRecordTargetHasExpectedTagName(target:HTMLElement) {
        if (!target) return false
        return (target as HTMLElement).tagName == "DIV" || (target as HTMLElement).tagName == "SPAN"
    }
    public  static mutationRecordTargetHasExpectedClass({target}:MutationRecord) {
        for (const classItem of this.classList) {
            if ((target as HTMLElement).classList.contains(classItem)) return true
        }
        return false
    }

}