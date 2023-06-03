import EventBus from "../EventBus";
import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import PanelObserver from "./observers/PanelObserver";
import DockObserver from "./observers/DockObserver";
import PanelEventPublisher from "./PanelEventPublisher";
import {InitEvent} from "../EventBus/types/Event";
import {PanelEventMessage} from "./types/PanelEvent";
import DomPanelPublisherInitEvent from "./types/DomPanelPublisherInitEvent";

export default class TanaDomPanelListener extends TanaPubSubModule {
    private panelObserver:PanelObserver
    private dockObserver:DockObserver
    private panelEventPublisher = new PanelEventPublisher(this,this.eventBus.dispatchRuntimeEvent)
    constructor(eventBus:EventBus) {
        super(eventBus);
        this.panelObserver = new PanelObserver(this)
        this.dockObserver = new DockObserver(this)
    }

    public initObservers() {
        this.dockObserver.init()
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