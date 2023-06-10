import PanelMutationHandler from "./PanelMutationHandler"


export default class PanelStateHandler {
    private panelObservers:Map<HTMLElement,MutationObserver> = new Map()
    private panelHeaderObservers:Map<HTMLElement,MutationObserver> = new Map()
    private panelContainerObservers: Map<HTMLElement,MutationObserver> = new Map()
    private mainDockObserver: MutationObserver
    private dockContainerObserver: MutationObserver

    constructor(panelMutationHandler:PanelMutationHandler) {
        this.mainDockObserver = new MutationObserver(panelMutationHandler.panelIdChangeMutationHandler)
        this.dockContainerObserver = new MutationObserver(panelMutationHandler.handleDockContainerChildListMutationEvent)
    }

    getMainDockObserver() {
        return this.mainDockObserver
    }

    getDockContainerObserver() {
        return this.dockContainerObserver
    }

    getPanelContainerObserver(panelContainer:HTMLElement) {
        return this.panelContainerObservers.get(panelContainer)
    }

    addPanelContainerObserver(panelContainer:HTMLElement, observer:MutationObserver) {
        this.panelContainerObservers.set(panelContainer,observer)
    }

    removePanelContainerObserver(panelContainer:HTMLElement) {
        this.panelContainerObservers.delete(panelContainer)
    }

    getPanelObserver(panel:HTMLElement) {
        return this.panelObservers.get(panel)
    }

    addPanelObserver(panel:HTMLElement,observer:MutationObserver) {
        this.panelObservers.set(panel,observer)
    }

    removePanelObserver(panel:HTMLElement) {
        this.panelObservers.delete(panel)
    }

    getPanelHeaderObserver(panelHeader:HTMLElement) {
        return this.panelHeaderObservers.get(panelHeader)
    }

    addPanelHeaderObserver(panelHeader:HTMLElement,observer:MutationObserver) {
        this.panelHeaderObservers.set(panelHeader,observer)
    }

    removePanelHeaderObserver(panelHeader:HTMLElement) {
        this.panelHeaderObservers.delete(panelHeader)
    }

}