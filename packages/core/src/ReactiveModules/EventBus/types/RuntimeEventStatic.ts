import RuntimeEventInstance from "./RuntimeEventInstance";
import RuntimeEvent from "./RuntimeEvent";


export default class RuntimeEventStatic<T> extends RuntimeEvent<T> {
    createInstance(message:T) {
        return new RuntimeEventInstance(this.identifier,message)
    }
}