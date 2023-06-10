import { Maybe } from "purify-ts"
import PanelMutationHandler from "./PanelMutationHandler"


export default class PanelStateHandler {
    private panelHeaderObservers:Map<HTMLElement,MutationObserver> = new Map()
    private panelContainerObservers: Map<HTMLElement,MutationObserver> = new Map()
    private dockObservers: Map<HTMLElement,MutationObserver> = new Map()
    private dockContainerObserver: MutationObserver

    constructor(panelMutationHandler:PanelMutationHandler) {
        this.dockContainerObserver = new MutationObserver(panelMutationHandler.handleDockContainerChildListMutationEvent)
    }

    getDockContainerObserver() {
        return this.dockContainerObserver
    }

    getDockObserver(dock:HTMLElement) {
        return this.dockObservers.get(dock)
    }

    addDockObserver(dock:HTMLElement, observer:MutationObserver) {
        this.dockObservers.set(dock,observer)
    }

    removeDockObserver(dock:HTMLElement) {
        Maybe.fromNullable(this.dockObservers.get(dock))
        .map(observer => observer.disconnect())
        this.dockObservers.delete(dock)
    }

    getPanelContainerObserver(panelContainer:HTMLElement) {
        return this.panelContainerObservers.get(panelContainer)
    }

    addPanelContainerObserver(panelContainer:HTMLElement, observer:MutationObserver) {
        this.panelContainerObservers.set(panelContainer,observer)
    }

    removePanelContainerObserver(panelContainer:HTMLElement) {
        Maybe.fromNullable(this.panelContainerObservers.get(panelContainer))
            .map(observer => observer.disconnect())
        this.panelContainerObservers.delete(panelContainer)
    }

    getPanelHeaderObserver(panelHeader:HTMLElement) {
        return this.panelHeaderObservers.get(panelHeader)
    }

    addPanelHeaderObserver(panelContainer:HTMLElement,observer:MutationObserver) {
        this.panelHeaderObservers.set(panelContainer,observer)
    }

    removePanelHeaderObserver(panelContainer:HTMLElement) {
        Maybe.fromNullable(this.panelHeaderObservers.get(panelContainer))
        .map(observer => observer.disconnect())
        this.panelHeaderObservers.delete(panelContainer)
    }



}