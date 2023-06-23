import { Maybe } from "purify-ts";
import TanaDomNodeProvider from "../TanaDomNodeProvider";
import TanaConstants from "../TanaDomNodeProvider/TanaConstants";
import { NodeEventTypeEnum } from "../../ReactiveModules/TanaNodeEventModule/types/types";

export default new class MutationRecordAttributeInspector extends TanaConstants {

    private  classList:string[] = [
        this.getContentSideCssClass(),
        this.getContentNodeCssClass(),
        this.getExpandedNodeCssClass(),
        this.getPanelContentCssClass(),
        this.getNonTemplateCssClass()
    ]

    public  getMutationEventType(mutation:MutationRecord): NodeEventTypeEnum {
        const removedNodes = Array.from(mutation.removedNodes) as HTMLElement[]
        const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[]
        const isRemoveEvent = !!TanaDomNodeProvider.getContentNodeFromArray(removedNodes)
        const isAddedEvent = !!TanaDomNodeProvider.getContentNodeFromArray(addedNodes)
        if (isAddedEvent && isRemoveEvent) throw new Error("Tana content node exists in both the remove and added nodes array.")
        if (isRemoveEvent) return NodeEventTypeEnum.Deletion
        if (isAddedEvent) return NodeEventTypeEnum.Insertion
        const isCollapseEvent = !!TanaDomNodeProvider.getExpandedNodeFromArray(removedNodes)
        const isExpandEvent = !!TanaDomNodeProvider.getExpandedNodeFromArray(addedNodes)
        if (isExpandEvent && isCollapseEvent) throw new Error("ExpandedNode exists in both the remove and added nodes array which should not be possible.")
        if (isCollapseEvent) return NodeEventTypeEnum.BulletCollapse
        if (isExpandEvent) return  NodeEventTypeEnum.BulletExpand
        return NodeEventTypeEnum.Update
    }

    public  mutationInvolvesPanelContainer(mutation:MutationRecord):boolean {
        const isRemoval = mutation.removedNodes.length > 0
        const htmlElement = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]) as HTMLElement
        return Maybe.fromFalsy(htmlElement.childNodes.length > 0 && htmlElement.tagName == "DIV")
            .map(_ => {
                const panelSelector = this.attributeSelector(this.getPanelAttribute())
                return (htmlElement.childNodes[0] as HTMLElement).hasAttribute(panelSelector)
            })
            .orDefault(false)
    }
    
    public  nodeHasClassPrefix(node:HTMLElement,classPrefix:string):boolean {
        if (!node.hasOwnProperty('classList')) return false
        for (const classItem of Array.from(node.classList)) {
            if (!!classItem.match(classPrefix)) return true
        }
        return false
    }

    public mutationRecordContainsBulletModule(mutation:MutationRecord):boolean{
        const isRemoval = mutation.removedNodes.length > 0
        const node = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0] ) as HTMLElement
        const bulletModuleSelector = this.getBulletModulePrefix()
        return this.nodeHasClassPrefix(node,bulletModuleSelector)
    }

    public  mutationRecordTargetHasExpectedTagName(target:HTMLElement):boolean {
        if (!target) return false
        return (target as HTMLElement).tagName == "DIV" || (target as HTMLElement).tagName == "SPAN"
    }

    public  mutationRecordTargetHasExpectedClass({target}:MutationRecord):boolean {
        for (const classItem of this.classList) {
            if ((target as HTMLElement).classList.contains(classItem)) return true
        }
        return false
    }

}