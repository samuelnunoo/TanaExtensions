import TanaConstants from "./TanaConstants";

export default new class TanaDomNodeProvider extends TanaConstants  {

    public getDockContainer(doc:Document) {
        return doc.querySelector(this.getDockContainerAttributeSelector())
    }

    public getMainDock(doc:Document) {
        return doc.querySelector(this.getMainDockAttributeSelector())
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
    public  getAllContentNodesOnPage(dom:Document): HTMLElement[] {
        const bulletAndContent = this.classSelector(this.getContentNodeCssClass())
        return Array.from(dom.querySelectorAll(bulletAndContent)) as HTMLElement[]
    }

    public  getWrapperNodeFromAncestor(ancestor:HTMLElement) {
        if (!ancestor) return
        const wrapperAndMenu = this.classSelector(this.getTanaWrapperCssClass())
        return ancestor.querySelector(wrapperAndMenu)
   }

   /*
    This method provides the panel header node from a panel
    where the panel header is the main title block (title text and template tags) you see on any panel.
    */
    public  getPanelHeaderFromAncestor(ancestor:HTMLElement) {
        if (!ancestor) return
        const panelHeader = this.attributeSelector(this.getTanaPanelHeaderAttribute())
        return ancestor.querySelector(panelHeader) as HTMLElement
    }

    public  getAllContentNodesOnPanel(panel:HTMLElement) {
        const bulletAndContent = this.classSelector(this.getContentNodeCssClass())
        return Array.from(panel.querySelectorAll(bulletAndContent)) as HTMLElement[]
    }

    /*
    This method takes a descendant of a content node and tries to find its
    BulletAndContent ancestor
     */
    public  getContentNodeFromDescendant(descendant:HTMLElement) {
        const bulletAndContent = this.classSelector(this.getContentNodeCssClass())
        return descendant.closest(bulletAndContent)
    }

    public  getEditableNodeFromAncestor(ancestor:HTMLElement) {
        const bulletAndContent = this.classSelector(this.getContentNodeCssClass())
        return ancestor.querySelector(bulletAndContent)
    }

    /*
    This method takes a descendant of a panel and returns
    the panel it belongs to
     */
    public  getPanelFromDescendant(node: HTMLElement) {
        const panelSelector = this.attributeSelector(this.getPanelAttribute())
        return node.closest(panelSelector)
    }

    public  getAllContentNodesOnPageAsMap() {
        const map:Map<string,HTMLElement> = new Map()
        const domNodes = this.getAllContentNodesOnPage(document)
        domNodes.forEach(domNode => {
            const id = this.getIdFromElement(domNode)
            map.set(id!,domNode)
        })
        return map
    }

    public  getIdFromElement(element:HTMLElement){
       const bulletAndContent = this.classSelector(this.getContentNodeCssClass())
       const wrapperSelector = this.classSelector(this.getTanaWrapperCssClass())
       if (!element.classList.contains(bulletAndContent) && !element.classList.contains(wrapperSelector)) return null
       const dataId = element.getAttribute("data-id") || element.id
       if (!dataId || dataId == "") return null
       return dataId!.split("|").pop()
    }

    public  getNodeWithClassPrefixFromArray(elementArray:HTMLElement[],classPrefix:string) {
        for (const element of elementArray) {
            if (!('classList' in element)) continue
            for (const classItem of Array.from(element.classList)) {
                if (!!classItem.match(classPrefix)) return element
            }
        }
        return null
    }

    public  getContentNodeFromArray(nodes:HTMLElement[]) {
        const bulletAndContent = this.classSelector(this.getContentNodeCssClass())
        return this.getNodeWithClassFromArray(nodes,bulletAndContent)
    }

    public getExpandedNodeFromArray(nodes:HTMLElement[]){
        const expandedNode = this.classSelector(this.getExpandedNodeCssClass())
        return this.getNodeWithClassFromArray(nodes,expandedNode)
    }

    private getNodeWithClassFromArray(elementArray:HTMLElement[],className:string) {
        for (const element of elementArray) {
            if (!('classList' in element)) continue
            if (element.classList.contains(className)) return element
        }
        return null
    }

}
