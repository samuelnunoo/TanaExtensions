import RuntimeEvent from "./RuntimeEvent";

export default class RuntimeEventInstance<T> extends RuntimeEvent {
    message:T
    constructor(identifier:string,message:T) {
        super(identifier);
        this.identifier = identifier
        this.message = message
    }

    getMessage() {
        return this.message
    }
}

