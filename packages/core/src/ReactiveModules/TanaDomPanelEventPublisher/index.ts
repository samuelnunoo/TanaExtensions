import EventBus from "../EventBus";
import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import PanelEventPublisher from "./PanelEventPublisher";
import {InitEvent} from "../EventBus/types/Event";
import DomPanelPublisherInitEvent from "./types/DomPanelPublisherInitEvent";
import PanelStateHandler from "./PanelStateHandler";
import PanelMutationHandler from "./PanelMutationHandler";

export default class TanaDomPanelEventPublisher extends TanaPubSubModule {
    private panelEventPublisher = new PanelEventPublisher(this,this.eventBus)
    private panelStateHandler:PanelStateHandler
    private panelMutationHandler:PanelMutationHandler

    constructor(eventBus:EventBus) {
        super(eventBus);
        this.panelMutationHandler = new PanelMutationHandler(this)
        this.panelStateHandler = new PanelStateHandler(this.panelMutationHandler)
    }

    public getEventModuleInvokesOnCompletion(): InitEvent {
        return DomPanelPublisherInitEvent
    }

    public getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.panelEventPublisher
        ]
    }
 
    public getPanelStateHandler(): PanelStateHandler {
        return this.panelStateHandler
    }

    public getPanelMutationHandler():PanelMutationHandler {
        return this.panelMutationHandler
    }

    public dispatchPanelEvent(panel:HTMLElement,panelContainer:HTMLElement,dataPanelId:string,isRemoval:boolean): void {
        this.panelEventPublisher.dispatchPanelEvent(panel,panelContainer,dataPanelId,isRemoval)
    }
}

