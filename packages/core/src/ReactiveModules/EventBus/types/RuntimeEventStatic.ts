import RuntimeEventInstance from "./RuntimeEventInstance";
import RuntimeEvent from "./RuntimeEvent";


export default class RuntimeEventStatic<T> extends RuntimeEvent {
    createInstance(message:T) {
        return new RuntimeEventInstance<T>(this.identifier,message)
    }
}