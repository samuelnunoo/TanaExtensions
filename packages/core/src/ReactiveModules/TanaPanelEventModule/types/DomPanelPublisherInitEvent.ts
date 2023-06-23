import {InitEvent} from "../../EventBus/types/Event";


export default new class DomPanelPublisherInitEvent extends InitEvent {
    getIdentifier(): string {
        return "domPanelPublisherInitEvent";
    }


}