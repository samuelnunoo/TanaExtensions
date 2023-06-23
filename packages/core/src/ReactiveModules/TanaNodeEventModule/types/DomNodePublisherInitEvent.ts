import {InitEvent} from "../../EventBus/types/Event";


export default new class DomNodePublisherInitEvent extends InitEvent {
    getIdentifier(): string {
        return "domNodePublisherInitEvent";
    }

}