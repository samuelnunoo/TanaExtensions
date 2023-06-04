import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import onDomRenderCompleteEvent from "../TanaModuleLoader/types/OnDomRenderCompleteEvent";
import TanaDomPanelEventPublisher from "./index";
import PanelEvent, {PanelEventMessage} from "./types/PanelEvent";


export default class PanelEventPublisher extends TanaPublisher<TanaDomPanelEventPublisher> {
    getInitRequirements(): InitEvent[] {
        return [
            onDomRenderCompleteEvent
        ];
    }

    onInitComplete() {
     this.mediator.initObservers()
    }

    dispatchPanelEvent(message:PanelEventMessage) {
        this.dispatchRuntimeEvent(PanelEvent.createInstance(message))
    }













}