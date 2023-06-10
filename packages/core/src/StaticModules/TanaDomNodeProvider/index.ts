import TanaConstants from "./TanaConstants";

export default new class TanaDomNodeProvider extends TanaConstants  {

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
