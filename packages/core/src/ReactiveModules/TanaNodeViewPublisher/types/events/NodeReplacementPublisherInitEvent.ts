import { InitEvent } from "../../../EventBus/types/Event";



export default new class NodeReplacementPublisherInitEvent extends InitEvent {
    getIdentifier(): string {
       return "NodeReplacementPublisherInit"
    }
    
}