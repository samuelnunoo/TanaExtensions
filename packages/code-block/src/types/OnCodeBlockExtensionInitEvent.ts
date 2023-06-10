import { InitEvent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";


export default new class OnCodeBlockExtensionInitEvent extends InitEvent {
    getIdentifier(): string {
        return "onCodeBlockExtensionInitEvent"
    }
}