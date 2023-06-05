import TanaPubSubModule, {
    TanaPubSubComponent
} from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import OnChromeEventRelayInit from "../types/OnChromeEventRelayInit";


export default class ChromeEventRelayModule extends TanaPubSubModule {
    getEventModuleInvokesOnCompletion(): InitEvent {
        return OnChromeEventRelayInit;
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [];
    }


}