import {InitEvent} from "../../EventBus/types/Event";


export default new class OnStartEvent extends InitEvent {
    getIdentifier(): string {
        return "OnStartEvent";
    }

}