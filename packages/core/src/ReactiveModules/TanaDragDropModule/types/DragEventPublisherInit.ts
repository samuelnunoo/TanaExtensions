import { InitEvent } from "../../EventBus/types/Event";


export default new class DragEventPublisherInit extends InitEvent {
    getIdentifier(): string {
        return "DragEventPublisherInit"
    }
    
}