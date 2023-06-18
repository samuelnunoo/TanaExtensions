import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event"
export default new class OnDatabaseInitEvent extends InitEvent {
    getIdentifier(): string {
        return "onDatabaseInitEvent";
    }
}