import EventBus from "../EventBus";
import {InitEvent} from "../EventBus/types/Event";
import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import DomNodePublisherInitEvent from "./types/DomNodePublisherInitEvent";
import {NodeEventMessage} from "./types/NodeEvent";
import NodeEventPublisher from "./NodeEventPublisher";
import PanelEventSubscriber from "./PanelEventSubscriber";

export default class TanaDomNodeEventModule extends TanaPubSubModule {

    eventBus:EventBus
    nodeEventPublisher = new NodeEventPublisher(this,this.eventBus.dispatchRuntimeEvent)
    panelEventSubscriber = new PanelEventSubscriber(this,this.eventBus.subscribeToRuntimeEvent)

    constructor(eventBus:EventBus) {
        super(eventBus);
        this.eventBus = eventBus
    }

    public invokeNodeEvent(message:NodeEventMessage) {
        this.nodeEventPublisher.invokeNodeEvent(message)
    }
    getEventModuleInvokesOnCompletion(): InitEvent {
        return DomNodePublisherInitEvent
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
             this.nodeEventPublisher,
            this.panelEventSubscriber

        ];
    }


}