import { InitEvent} from "./ReactiveModules/EventBus/types/Event";


export default new class OnMainInitEvent extends InitEvent {
    getIdentifier(): string {
        return "onMainInitEvent";
    }

}