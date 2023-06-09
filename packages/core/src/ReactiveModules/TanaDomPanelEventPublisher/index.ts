import EventBus from "../EventBus";
import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import PanelObserver from "./observers/PanelObserver";
import DockObserver from "./observers/DockObserver";
import PanelEventPublisher from "./PanelEventPublisher";
import {InitEvent} from "../EventBus/types/Event";
import {PanelEventMessage} from "./types/PanelEvent";
import DomPanelPublisherInitEvent from "./types/DomPanelPublisherInitEvent";

export default class TanaDomPanelEventPublisher extends TanaPubSubModule {
    private panelObserver:PanelObserver
    private dockObserver:DockObserver
    private panelEventPublisher = new PanelEventPublisher(this,this.eventBus)

    constructor(eventBus:EventBus) {
        super(eventBus);
        this.panelObserver = new PanelObserver(this)
        this.dockObserver = new DockObserver(this)
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



    public init() {
        this.initObservers()
        this.invokeInitialPanelEvents()
    }
    public initObservers() {
        this.dockObserver.init()
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

    public getEventModuleInvokesOnCompletion(): InitEvent {
        return DomPanelPublisherInitEvent
    }
    public getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.panelEventPublisher
        ]
    }
    public observePanels(panels:HTMLElement[]) {
        this.panelObserver.observePanels(panels)
    }

    public unobservePanels(panels:HTMLElement[]) {
        this.panelObserver.unobservePanels(panels)
    }

    public mutationInvolvesPanelContainer(mutation:MutationRecord) {
        return this.panelObserver.mutationInvolvesPanelContainer(mutation)
    }

    public unobserveDockPanelContainers(panelContainers:HTMLElement[]) {
        this.panelObserver.unobserveDockPanelContainers(panelContainers)
    }

    public dispatchPanelEvent(panel:HTMLElement,panelContainer:HTMLElement,panelId:string,isRemoval:boolean) {
        const message:PanelEventMessage = this.panelObserver.createPanelEvent(panel,panelContainer,panelId,isRemoval)
        this.panelEventPublisher.dispatchPanelEvent(message)
    }

    public observeDockPanelContainers(panelContainers:HTMLElement[]) {
        this.panelObserver.observeDockPanelContainers(panelContainers)
    }


}