import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";


export default new class OnChromeEventRelayInit extends InitEvent {
    getIdentifier(): string {
        return "onChromeEventRelayInit";
    }

}