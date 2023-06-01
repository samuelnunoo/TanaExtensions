import TanaDomNodeProvider from "../TanaDomNodeProvider";
import {
    BULLET_CONTENT_CSS_CLASS,
    BULLET_CONTENT_CSS_SELECTOR,
    BULLET_MODULE_CLASS_PREFIX,
    CONTENT_SIDE_CSS_CLASS,
    EDITABLE_CSS_CLASS,
    EXPANDED_NODE_CSS_CLASS,
    INodeDOMListener,
    NodeEvent,
    NodeEventTypeEnum,
    NodeTargetTypeEnum,
    NON_TEMPLATE_CSS_CLASS,
    PANEL_CONTENT_CSS_CLASS
} from "./types";
import {
    IDomPanelListener,
    PanelEvent,
    PanelEvenTypeEnum,
} from "../TanaDomPanelEventObserver/types/types";
import TanaStateProvider from "../TanaStateProvider";
import {TanaNode} from "../TanaStateProvider/types/types";
import {TANA_WRAPPER_CSS_SELECTOR} from "../TanaDomNodeProvider/types";
import BaseObserver from "../BaseObserver";
import {TANA_DATA_PANEL_CSS_SELECTOR} from "../TanaDomPanelEventObserver/types/constants";

export default new class TanaDomNodeEventObserver extends BaseObserver<INodeDOMListener> implements IDomPanelListener {
    private classList:string[] = [
        CONTENT_SIDE_CSS_CLASS,
        EDITABLE_CSS_CLASS,
        BULLET_CONTENT_CSS_CLASS,
        EXPANDED_NODE_CSS_CLASS,
        PANEL_CONTENT_CSS_CLASS,
        NON_TEMPLATE_CSS_CLASS
    ]
    private hasInitialized = false
    public initialize() {
        if (this.hasInitialized) return
        this.hasInitialized = true
        const originalMutationObserver = MutationObserver
        const {shouldProcessMutationRecord,processMutationRecord} = this
        const classThisArg = this
        //@ts-ignore
        MutationObserver = function(...args) {
            const callback = args[0];
            args[0] = function(mutationsList:MutationRecord[], observer:MutationObserver) {
                for (const mutation of mutationsList) {
                    if (!shouldProcessMutationRecord.bind(classThisArg)(mutation)) continue
                    processMutationRecord.bind(classThisArg)(mutation)
                }
                return callback.apply(this, arguments);
            }
            //@ts-ignore
            return new originalMutationObserver(...args);
        }
    }
    private invokeListeners(nodeEvent:NodeEvent) {
        for (const listener of this.listeners) {
            listener.onNodeEvent(nodeEvent)
        }
    }
    private getMutationEventType(mutation:MutationRecord) {
        const removedNodes = Array.from(mutation.removedNodes) as HTMLElement[]
        const addedNodes = Array.from(mutation.addedNodes) as HTMLElement[]
        const isRemoveEvent = !!TanaDomNodeProvider.getNodeWithClassFromArray(removedNodes,BULLET_CONTENT_CSS_CLASS)
        const isAddedEvent = !!TanaDomNodeProvider.getNodeWithClassFromArray(addedNodes,BULLET_CONTENT_CSS_CLASS)
        if (isAddedEvent && isRemoveEvent) throw new Error("Tana content node exists in both the remove and added nodes array.")
        if (isRemoveEvent) return NodeEventTypeEnum.Deletion
        if (isAddedEvent) return NodeEventTypeEnum.Insertion
        return NodeEventTypeEnum.Update
    }
    private processMutationRecord(mutation:MutationRecord) {
        const nodeEventType = this.getMutationEventType(mutation)
        const mutatingElement = (nodeEventType == NodeEventTypeEnum.Deletion ? mutation.removedNodes[0] : mutation.addedNodes[0]) as HTMLElement
        const targetType = this.getTargetType(mutation.target as HTMLElement)
        if (targetType == null) return
        const nodeElement = this.getBlockFromDescendant(mutation.target as HTMLElement,mutatingElement,targetType) as HTMLElement
        if (!nodeElement) return
        const blockId = TanaDomNodeProvider.getIdFromElement(nodeElement)
        if (blockId == null) return
        const panel = TanaDomNodeProvider.getPanelFromNode(nodeElement) as HTMLElement
        if (!panel) return
        const tanaNode = TanaStateProvider.getNodeWithId(blockId)
        if (!tanaNode) return
        const nodeEvent = this.createNodeEvent(
            nodeElement!,
            tanaNode!,
            blockId!,
            nodeEventType!,
            panel!,
            false
        )
        this.invokeListeners(nodeEvent)
    }
    onPanelEvent({panel,panelEventType}: PanelEvent): void {
        const contentNodes = TanaDomNodeProvider.getAllContentNodesOnPanel(panel)
        const headerNode = TanaDomNodeProvider.getPanelHeaderFromPanel(panel)
        const nodeEventType = this.getNodeEventType(panelEventType)
        this.createEventForPanelHeaderNode(headerNode as HTMLElement,panel,nodeEventType)
        contentNodes.forEach(nodeElement => {
            const nodeId = TanaDomNodeProvider.getIdFromElement(nodeElement)
            if (!nodeId) return
            const tanaNode = TanaStateProvider.getNodeWithId(nodeId)
            if (!tanaNode) return
            const nodeEvent = this.createNodeEvent(nodeElement,tanaNode,nodeId,nodeEventType,panel,false)
            this.invokeListeners(nodeEvent)
        })
    }
    private getNodeEventType(panelEventType:PanelEvenTypeEnum) {
        return panelEventType == PanelEvenTypeEnum.Deletion
            ? NodeEventTypeEnum.Deletion :
            panelEventType == PanelEvenTypeEnum.Insertion ? NodeEventTypeEnum.Insertion
            : NodeEventTypeEnum.Update
    }
    private createEventForPanelHeaderNode(panelHeaderNode:HTMLElement|null|undefined,panel:HTMLElement,nodeEventType:NodeEventTypeEnum) {
        if (!panelHeaderNode) return
        const wrapperNode = panelHeaderNode.querySelector(TANA_WRAPPER_CSS_SELECTOR)
        if (!wrapperNode) return
        const nodeId = wrapperNode.id
        if (!nodeId) return
        const tanaNode = TanaStateProvider.getNodeWithId(nodeId)
        if (!tanaNode) return
        const nodeEvent = this.createNodeEvent(panelHeaderNode,tanaNode,nodeId,nodeEventType,panel,true)
        this.invokeListeners(nodeEvent)
    }
    private getTargetType(target:HTMLElement) {
        if (!('classList' in target)) return null
        if (target.classList.contains(CONTENT_SIDE_CSS_CLASS)) return NodeTargetTypeEnum.ContentSide
        if (target.classList.contains(BULLET_CONTENT_CSS_CLASS)) return NodeTargetTypeEnum.BulletAndContent
        if (target.classList.contains(EDITABLE_CSS_CLASS)) return NodeTargetTypeEnum.Editable
        if (target.classList.contains(PANEL_CONTENT_CSS_CLASS)) return NodeTargetTypeEnum.PanelContent
        if (target.classList.contains(NON_TEMPLATE_CSS_CLASS)) return NodeTargetTypeEnum.NonTemplateContent
        if (target.classList.contains(EXPANDED_NODE_CSS_CLASS)) return NodeTargetTypeEnum.ExpandedNodeContent
        return null
    }
    private getBlockFromDescendant(target:HTMLElement,element:HTMLElement,targetType:NodeTargetTypeEnum) {
        switch(targetType) {
            case NodeTargetTypeEnum.Editable:
                return target.closest(BULLET_CONTENT_CSS_SELECTOR) as HTMLElement
            case NodeTargetTypeEnum.BulletAndContent:
                return target as HTMLElement
            case NodeTargetTypeEnum.ExpandedNodeContent:
                return target.closest(BULLET_CONTENT_CSS_SELECTOR) as HTMLElement
            case NodeTargetTypeEnum.PanelContent:
                return target.closest(TANA_DATA_PANEL_CSS_SELECTOR) as HTMLElement
            case NodeTargetTypeEnum.NonTemplateContent:
                return element as HTMLElement
            case NodeTargetTypeEnum.ContentSide:
                return element.closest(BULLET_CONTENT_CSS_SELECTOR) as HTMLElement
            default:
                return null
        }
    }
    private shouldProcessMutationRecord(mutation:MutationRecord) {
        if (mutation.type !== "childList") return false
        if (!this.mutationRecordTargetHasExpectedTagName(mutation.target as HTMLElement)) return false
        if (this.mutationRecordContainsBulletModule(mutation)) return false
        if (!this.mutationRecordTargetHasExpectedClass(mutation)) return false
        return true
    }
    private nodeHasClassPrefix(node:HTMLElement,classPrefix:string) {
        if (!node.hasOwnProperty('classList')) return false
        for (const classItem of Array.from(node.classList)) {
            if (!!classItem.match(classPrefix)) return true
        }
        return false
    }
    private mutationRecordContainsBulletModule(mutation:MutationRecord) {
        const isRemoval = mutation.removedNodes.length > 0
        const node = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0] ) as HTMLElement
        return this.nodeHasClassPrefix(node,BULLET_MODULE_CLASS_PREFIX)
    }
    private mutationRecordTargetHasExpectedTagName(target:HTMLElement) {
        if (!target) return false
        return (target as HTMLElement).tagName == "DIV" || (target as HTMLElement).tagName == "SPAN"
    }
    private mutationRecordTargetHasExpectedClass({target}:MutationRecord) {
        for (const classItem of this.classList) {
            if ((target as HTMLElement).classList.contains(classItem)) return true
        }
        return false
    }
    private createNodeEvent(nodeElement:HTMLElement, tanaNode:TanaNode,nodeId:string,nodeEventType:NodeEventTypeEnum,panel:HTMLElement,isHeaderNode:boolean) {
        return {
            nodeElement,
            tanaNode,
            nodeId,
            nodeEventType,
            panel,
            isHeaderNode
        } as NodeEvent
    }
}