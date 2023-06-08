import {
    DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME,
    MAIN_PANEL_CONTAINER_ATTRIBUTE_NAME,
    MAIN_PANEL_CONTAINER_ATTRIBUTE_VALUE, RIGHT_DOCK_ATTRIBUTE_VALUE,
    TANA_DATA_PANEL_ATTRIBUTE, TOP_DOCK_ATTRIBUTE_VALUE
} from "../types/constants";
import TanaDomNodeProvider from "../../../StaticModules/TanaDomNodeProvider";
import {PanelContainerType, PanelEvent, PanelEvenTypeEnum} from "../types/types";
import TanaDomPanelEventPublisher from "../index";


export default class PanelObserver {

    mediator: TanaDomPanelEventPublisher
    constructor(mediator:TanaDomPanelEventPublisher) {
        this.mediator = mediator
    }
    private panelContainerObservers: Map<HTMLElement,MutationObserver> = new Map()
    private panelObserver: Map<HTMLElement,MutationObserver> = new Map()
    private panelHeaderObservers: Map<HTMLElement,MutationObserver> = new Map()

    public createPanelEvent(panel:HTMLElement,panelContainer:HTMLElement,panelId:string,isRemoval:boolean) {
        const panelContainerType = this.getPanelContainerType(panelContainer)
        const panelEventType = isRemoval ? PanelEvenTypeEnum.Deletion : PanelEvenTypeEnum.Insertion
        return {
            panelId,
            panel,
            panelContainerType,
            panelEventType
        } as PanelEvent
    }
    public observePanels(panels:HTMLElement[]) {
        panels.forEach(panel => {
            this.unobservePanels([panel])
            const mutationObserver = new MutationObserver(this.handlePanelIdChangeEvent.bind(this))
            mutationObserver.observe(panel,{
                attributeFilter: [TANA_DATA_PANEL_ATTRIBUTE]
            })
            this.panelObserver.set(panel,mutationObserver)

            const panelHeaderMutationObserver = new MutationObserver(this.handlePanelHeaderChangeEvent.bind(this))
            const panelTemplateContainer = TanaDomNodeProvider.getPanelHeaderTemplateContainerFromPanel(panel)
            if (!panelTemplateContainer) return
            panelHeaderMutationObserver.observe(panelTemplateContainer,{
                childList:true
            })
            this.panelHeaderObservers.set(panel,panelHeaderMutationObserver)
        })
    }
    public unobservePanels(panels:HTMLElement[]) {
        panels.forEach(panel => {
            if (this.panelObserver.has(panel)) {
                this.panelObserver.get(panel)!.disconnect()
                this.panelObserver.delete(panel)
            }
            if (this.panelHeaderObservers.has(panel)) {
                this.panelHeaderObservers.get(panel)!.disconnect()
                this.panelHeaderObservers.delete(panel)
            }
        })
    }
    public observeDockPanelContainers(panelContainers:HTMLElement[]) {
        panelContainers.forEach(panelContainer => {
            this.unobserveDockPanelContainers([panelContainer])
            const mutationObserver = new MutationObserver(this.handlePanelContainerChildListMutationEvent.bind(this))
            mutationObserver.observe(panelContainer,{
                childList:true
            })
            this.panelContainerObservers.set(panelContainer,mutationObserver)
        })
    }
    public unobserveDockPanelContainers(panelContainers:HTMLElement[]) {
        panelContainers.forEach(panelContainer => {
            if (this.panelContainerObservers.has(panelContainer)) {
                this.panelContainerObservers.get(panelContainer)!.disconnect()
                this.panelContainerObservers.delete(panelContainer)
            }
        })
    }

    public mutationInvolvesPanelContainer(mutation:MutationRecord) {
        const isRemoval = mutation.removedNodes.length > 0
        const htmlElement = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]) as HTMLElement
        return htmlElement.childNodes.length > 0 && htmlElement.tagName == "DIV"
            ? (htmlElement.childNodes[0] as HTMLElement).hasAttribute(TANA_DATA_PANEL_ATTRIBUTE)
            : false
    }
    private handlePanelIdChangeEvent(mutationList:MutationRecord[],observer:MutationObserver) {
        for (const mutation of mutationList) {
            this.invokePanelIdChangeEvent(mutation)
        }
    }
    private handlePanelContainerChildListMutationEvent(mutationList:MutationRecord[], observer:MutationObserver) {
        for (const mutation of mutationList) {
            this.unobservePanels(Array.from(mutation.removedNodes) as HTMLElement[])
            this.observePanels(Array.from(mutation.addedNodes ) as HTMLElement[])
            this.invokePanelEvent(mutation)
        }
    }
    private handlePanelHeaderChangeEvent(mutationList:MutationRecord[]) {
        for (const mutation of mutationList) {
            const isRemoval = mutation.removedNodes.length > mutation.addedNodes.length
            const element = isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]
            const panel = TanaDomNodeProvider.getPanelFromNode(element as HTMLElement)
            if (!panel) return
            const panelContainer = panel.parentElement
            if (!panelContainer) return
            const dataPanelId = panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE)
            if (!dataPanelId) return
            this.mediator.dispatchPanelEvent(panel,panelContainer,dataPanelId,isRemoval)
        }
    }
    private invokePanelIdChangeEvent(mutation:MutationRecord) {
        const isRemove = mutation.removedNodes.length > 0
    }

    private invokePanelEvent(mutation:MutationRecord) {
        const isRemoval = mutation.removedNodes.length > 0
        const panel = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]) as HTMLElement
        const panelContainer = mutation.target.parentElement
        const dataPanelId = panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE)
        this.mediator.dispatchPanelEvent(panel,panelContainer!,dataPanelId!,isRemoval)
    }


    private getPanelContainerType(panelContainer:HTMLElement): PanelContainerType|null {
        if (panelContainer.hasAttribute(MAIN_PANEL_CONTAINER_ATTRIBUTE_NAME)) {
            if (panelContainer.getAttribute(MAIN_PANEL_CONTAINER_ATTRIBUTE_NAME) == MAIN_PANEL_CONTAINER_ATTRIBUTE_VALUE) {
                return PanelContainerType.MainPanelContainer
            }
        }
        if (panelContainer.hasAttribute(DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME)) {
            if (panelContainer.getAttribute(DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME) == TOP_DOCK_ATTRIBUTE_VALUE) {
                return PanelContainerType.TopPanelContainer
            }
            if (panelContainer.getAttribute(DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME) == RIGHT_DOCK_ATTRIBUTE_VALUE) {
                return PanelContainerType.RightPanelContainer
            }
        }
        return null
    }



}