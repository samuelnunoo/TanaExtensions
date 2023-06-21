import TanaStateProvider from "../TanaStateProvider";
import TanaConstants from "./TanaConstants";
import {Maybe} from "purify-ts";

export default new class TanaDomNodeProvider extends TanaConstants  {

    public getContentNodeHeaderFromAncestor(ancestor:HTMLElement) {
        return Maybe.fromNullable(ancestor.querySelector(this.classSelector(this.getContentSideCssClass())))
            .map(contentSide => contentSide.firstChild as HTMLElement)
            .extractNullable()
    }

    public getTanaNodeForNodeView(nodeView:HTMLElement) {
        const contentNodeId = this.getIdFromContentNodeDescendant(nodeView)
        if (contentNodeId) return TanaStateProvider.getNodeWithId(contentNodeId).extractNullable()
        
        return Maybe.fromNullable(this.getPanelFromDescendant(nodeView) as HTMLElement)
            .chainNullable(panel => this.getPanelHeaderFromAncestor(panel))
            .chainNullable(panelHeader => this.getWrapperNodeFromAncestor(panelHeader))
            .chainNullable(wrapperNode => TanaStateProvider.getNodeWithId(wrapperNode.id).extractNullable())
            .extractNullable()
    }

    public getContentNodeFromNodePath(nodePath:string) {
        return document.querySelector(`[${this.getContentNodeAttribute()}='${nodePath}']`) as HTMLElement
    }

    public getNodeViewFromDescendant(descendant:HTMLElement) {
        return descendant.closest(this.classSelector(this.getNodeViewCssClass())) as HTMLElement
    }

    public getListItemContainerFromAncestor(ancestor:HTMLElement) {
        return ancestor.querySelector(this.classSelector(this.getListItemCssClass()))
    }

    public getNodePathFromNodeId(nodeId:string,document:Document) {
        return Maybe.fromNullable(this.getContentDomNodeFromNodeId(document,nodeId))
            .chainNullable(tanaDomNode => tanaDomNode.getAttribute(this.getContentNodeAttribute()))
            .chainNullable(nodePathString => this.getTanaNodeArrayFromNodePath(nodePathString))
            .extractNullable()
    }

    public getNodePathFromContentNode(contentNode:HTMLElement) {
        return Maybe.fromNullable(contentNode.getAttribute(this.getContentNodeAttribute()))
            .map(nodePathString => this.getTanaNodeArrayFromNodePath(nodePathString))
            .extractNullable()
    }

    public getTanaNodeArrayFromNodePath(nodePath:string) {
        return Maybe.fromNullable(nodePath.split("|").map(nodeId => TanaStateProvider.getNodeWithId(nodeId)))
                    .chain(nodePath => Maybe.sequence(nodePath))
                    .extractNullable()
    }

    public getContentDomNodeFromNodeId(doc:Document,nodeId:string) {
        return doc.querySelector(`[${this.getContentNodeAttribute()}$=${nodeId}]`) as HTMLElement
    }

    public getNonTemplateNodeFromAncestor(ancestor:HTMLElement) {
        return ancestor.querySelector(this.classSelector(this.getNonTemplateCssClass()))
    }

    public getDockContainer(doc:Document) {
        return doc.querySelector(this.getDockContainerAttributeSelector())
    }

    public getMainDock(doc:Document) {
        return doc.querySelector(this.getMainDockAttributeSelector())
    }

    public getViewPanelContainerFromDescendant(descendant:HTMLElement) {
        return descendant.closest(this.classSelector(this.getViewPanelContainerCssClass()))
    }

    public getDescendantPanels(panelAncestor:HTMLElement) {
        return Array.from(panelAncestor.querySelectorAll(this.attributeSelector(this.getPanelAttribute()))) as HTMLElement[]
    }

    public getPanelContainerFromDock(dock:HTMLElement) {
        return dock.querySelector("div")
    }

    public getPanelFromAncestor(ancestor:HTMLElement) {
        return ancestor.querySelector(this.attributeSelector(this.getPanelAttribute()))
    }

    /*
    This method provides all of the nodes with the BulletAndContent class
    which in Tana wraps the editable data
     */
    public getAllContentNodesOnPage(dom:Document): HTMLElement[] {
        const bulletAndContentCssSelector = this.classSelector(this.getContentNodeCssClass())
        return Array.from(dom.querySelectorAll(bulletAndContentCssSelector)) as HTMLElement[]
    }

    public getWrapperNodeFromAncestor(ancestor:HTMLElement) {
        if (!ancestor) return
        const wrapperAndMenu = this.classSelector(this.getTanaWrapperCssClass())
        return ancestor.querySelector(wrapperAndMenu)
   }

   /*
    This method provides the panel header node from a panel
    where the panel header is the main title block (title text and template tags) you see on any panel.
    */
    public getPanelHeaderFromAncestor(ancestor:HTMLElement) {
        if (!ancestor) return
        const panelHeader = this.attributeSelector(this.getTanaPanelHeaderAttribute())
        return ancestor.querySelector(panelHeader) as HTMLElement
    }

    public getPanelHeaderTemplateContainerFromPanelContainer(panelContainer:HTMLElement) {
        if (!panelContainer) return 
        const panelHeader = this.getPanelHeaderFromAncestor(panelContainer)
        if (!panelHeader) return 
        const wrapperNode = panelHeader.querySelector(this.classSelector(this.getTanaWrapperCssClass()))
        if (!wrapperNode) return 
        return wrapperNode.querySelector("div")
    }

    public getAllContentNodesOnPanel(panel:HTMLElement) {
        const bulletAndContentSelector = this.classSelector(this.getContentNodeCssClass())
        return Array.from(panel.querySelectorAll(bulletAndContentSelector)) as HTMLElement[]
    }

    /*
    This method takes a descendant of a content node and tries to find its
    BulletAndContent ancestor
     */
    public getContentNodeFromDescendant(descendant:HTMLElement) {
        const bulletAndContentSelector = this.classSelector(this.getContentNodeCssClass())
        return descendant.closest(bulletAndContentSelector)
    }

    public getEditableNodeFromAncestor(ancestor:HTMLElement) {
        const bulletAndContentSelector = this.classSelector(this.getContentNodeCssClass())
        return ancestor.querySelector(bulletAndContentSelector)
    }

    /*
    This method takes a descendant of a panel and returns
    the panel it belongs to
     */
    public getPanelFromDescendant(node: HTMLElement) {
        const panelSelector = this.attributeSelector(this.getPanelAttribute())
        return node.closest(panelSelector)
    }

    public getAllContentNodesOnPageAsMap() {
        const map:Map<string,HTMLElement> = new Map()
        const domNodes = this.getAllContentNodesOnPage(document)
        domNodes.forEach(domNode => {
            const id = this.getIdFromElement(domNode)
            map.set(id!,domNode)
        })
        return map
    }

    public getIdFromElement(element:HTMLElement){
       if (!this.elementHasContentNodeClass(element) && !this.elementHasWrapperClass(element)) return null
       const dataId = element.getAttribute("data-id") || element.id
       if (!dataId || dataId == "") return null
       return dataId!.split("|").pop()
    }

    public getIdFromContentNodeDescendant(descendant:HTMLElement) {
       return Maybe.fromNullable(this.getContentNodeFromDescendant(descendant) as HTMLElement)
        .chainNullable(contentNode => this.getIdFromElement(contentNode))
        .extractNullable()
    }

    public getTanaNodeFromContentDomNodeDescendant(descendant:HTMLElement) {
        return Maybe.fromNullable(this.getIdFromContentNodeDescendant(descendant))
            .chainNullable(nodeId => TanaStateProvider.getNodeWithId(nodeId).extractNullable())
            .extractNullable()
    }

    public getNodeWithClassPrefixFromArray(elementArray:HTMLElement[],classPrefix:string) {
        for (const element of elementArray) {
            if (!('classList' in element)) continue
            for (const classItem of Array.from(element.classList)) {
                if (!!classItem.match(classPrefix)) return element
            }
        }
        return null
    }

    public getContentNodeFromArray(nodes:HTMLElement[]) {
        return this.getNodeWithClassFromArray(nodes,this.getContentNodeCssClass())
    }

    public getExpandedNodeFromArray(nodes:HTMLElement[]){
        return this.getNodeWithClassFromArray(nodes,this.getExpandedNodeCssClass())
    }

    private getNodeWithClassFromArray(elementArray:HTMLElement[],className:string) {
        for (const element of elementArray) {
            if (!('classList' in element)) continue
            if (element.classList.contains(className)) return element
        }
        return null
    }

    private elementHasWrapperClass(element: HTMLElement) {
        return element.classList.contains(this.getTanaWrapperCssClass());
    }

    private elementHasContentNodeClass(element: HTMLElement) {
        return element.classList.contains(this.getContentNodeCssClass());
    }

}
