import {InitEvent} from "../../EventBus/types/Event";


export default new class OnAppStateInitEvent extends InitEvent {
    getIdentifier(): string {
        return "OnAppStateInitEvent";
    }

}