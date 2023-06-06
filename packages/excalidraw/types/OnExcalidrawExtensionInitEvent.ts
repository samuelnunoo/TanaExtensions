import { InitEvent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";




export default new class OnExcalidrawExtensionInitEvent extends InitEvent {
    getIdentifier(): string {
        return "onExcalidrawExtensionInitEvent"
    }
    
}