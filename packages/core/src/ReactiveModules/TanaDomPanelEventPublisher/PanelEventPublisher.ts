import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import TanaDomPanelEventPublisher from "./index";
import PanelEvent, {PanelEventMessage} from "./types/PanelEvent";
import DomNodePublisherInitEvent from "../TanaDomNodeEventPublisher/types/DomNodePublisherInitEvent";


export default class PanelEventPublisher extends TanaPublisher<TanaDomPanelEventPublisher> {
    getInitRequirements(): InitEvent[] {
        return [
            DomNodePublisherInitEvent
        ];
    }

    onDependenciesInitComplete() {
     this.mediator.initObservers()
    }

    dispatchPanelEvent(message:PanelEventMessage) {
        this.dispatchRuntimeEvent(PanelEvent.createInstance(message))
    }













}