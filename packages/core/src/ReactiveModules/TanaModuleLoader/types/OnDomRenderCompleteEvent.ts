import {InitEvent} from "../../EventBus/types/Event";


export default new class OnDomRenderCompleteEvent extends InitEvent {
    getIdentifier(): string {
        return "OnDomRenderCompleteEvent";
    }

}