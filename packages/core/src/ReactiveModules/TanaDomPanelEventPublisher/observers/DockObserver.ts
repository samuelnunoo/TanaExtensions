import {
    MAIN_PANEL_CSS_SELECTOR,
    TANA_DATA_PANEL_ATTRIBUTE,
    TANA_DATA_PANEL_CSS_SELECTOR,
    TANA_DOCKS_CONTAINER_CSS_SELECTOR
} from "../types/constants";
import TanaDomPanelEventPublisher from "../index";
import {Maybe} from "purify-ts";


export default class DockObserver {

    mediator: TanaDomPanelEventPublisher
    constructor(mediator:TanaDomPanelEventPublisher) {
        this.mediator = mediator
    }
    private mainDockObserver = new MutationObserver(this.handleMainDockChildListMutationEvent.bind(this))
    private dockObserver: MutationObserver = new MutationObserver(this.handleDockContainerChildListMutationEvent.bind(this))

    public init() {
        this.initObservers()
        this.invokeInitialPanelEvents()
    }

    private initObservers() {
        const dockContainer = document.querySelector(TANA_DOCKS_CONTAINER_CSS_SELECTOR)
        const mainDock = dockContainer!.querySelector(MAIN_PANEL_CSS_SELECTOR)
        this.observeDocks(Array.from(dockContainer!.childNodes)as HTMLElement[])
        this.dockObserver.observe(dockContainer!,{
            childList: true
        })
        this.mainDockObserver.observe(mainDock!,{
            childList: true
        })
    }

    private handleDockContainerChildListMutationEvent(mutationList: MutationRecord[], observer: MutationObserver) {
        for (const mutation of mutationList) {
            this.unobserveDocks(Array.from(mutation.removedNodes) as HTMLElement[])
            this.observeDocks(Array.from(mutation.addedNodes) as HTMLElement[])
            this.invokeDockEvent(mutation)
        }
    }

    private invokeInitialPanelEvents() {
        const dockContainer = document.querySelector(TANA_DOCKS_CONTAINER_CSS_SELECTOR)
        const docks = Array.from(dockContainer!.childNodes)as HTMLElement[]
        docks.forEach(dock => {
            const panelContainer = dock.querySelector("div")
            const panels = Array.from(panelContainer!.childNodes) as HTMLElement[]
            panels.forEach(panel => {
                Maybe.fromNullable(panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE))
                    .map(dataPanelId => {
                        this.mediator.dispatchPanelEvent(
                            panel,panelContainer!,dataPanelId,false
                        )
                    })
            })
        })
    }

    private handleMainDockChildListMutationEvent(mutationList: MutationRecord[]) {
        for (const mutation of mutationList) {
            if (!this.mediator.mutationInvolvesPanelContainer(mutation)) continue
            const isRemove = mutation.removedNodes.length > 0
            const panelContainer = mutation.target as HTMLElement
            const panel = panelContainer.querySelector(TANA_DATA_PANEL_CSS_SELECTOR) as HTMLElement
            Maybe.fromNullable(panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE))
                .map(dataPanelId => {
                    this.mediator.dispatchPanelEvent(
                        panel, panelContainer,dataPanelId,isRemove
                    )
                })
        }
    }

    public observeDocks(docks:HTMLElement[]) {
        docks.forEach(dock => {
            const panelContainer = dock.querySelector("div")
            if (!panelContainer) return
            const panels = Array.from(panelContainer.childNodes) as HTMLElement[]
            this.mediator.observeDockPanelContainers([panelContainer])
            this.mediator.observePanels(panels)
        })
    }

    public unobserveDocks(docks: HTMLElement[]) {
        docks.forEach(dock => {
            const panelContainer = dock.querySelector("div")
            const panels = Array.from(panelContainer!.childNodes) as HTMLElement[]
            this.mediator.unobserveDockPanelContainers([panelContainer!])
            this.mediator.unobservePanels(panels)
        })
    }

    private invokeDockEvent(mutation:MutationRecord) {
        const isRemoval = mutation.removedNodes.length > 0
        const panelContainer = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]) as HTMLElement
        const panel = panelContainer.querySelector(TANA_DATA_PANEL_CSS_SELECTOR) as HTMLElement
        Maybe.fromNullable(panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE))
            .map(dataPanelId => {
                this.mediator.dispatchPanelEvent(
                    panel, panelContainer, dataPanelId, isRemoval,
                )
            })
    }


}