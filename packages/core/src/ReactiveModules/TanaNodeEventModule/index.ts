import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import {InitEvent} from "../EventBus/types/Event";
import DomNodePublisherInitEvent from "./types/DomNodePublisherInitEvent";
import NodeEventPublisher from "./NodeEventPublisher";
import PanelEventSubscriber from "./PanelEventSubscriber";
import {NodeEventMessage} from "./types/NodeEvent";
import EventBus from "../EventBus";

export default class TanaNodeEventModule extends TanaPubSubModule {

    constructor(eventBus:EventBus) {
        super(eventBus);
    }
    NodeEventPublisher = new NodeEventPublisher(this,this.eventBus)
    PanelEventSubscriber = new PanelEventSubscriber(this,this.eventBus)
    getEventModuleInvokesOnCompletion(): InitEvent {
        return DomNodePublisherInitEvent
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.NodeEventPublisher,
            this.PanelEventSubscriber
        ];
    }

    invokeNodeEvent(message:NodeEventMessage) {
        this.NodeEventPublisher.invokeNodeEvent(message)
    }



}