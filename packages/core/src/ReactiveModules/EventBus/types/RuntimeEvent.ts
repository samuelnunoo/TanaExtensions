import {BaseEvent, EventType} from "./Event";


export default class RuntimeEvent<T> implements BaseEvent {
    private identifier:string

    constructor(identifier:string) {
        this.identifier = identifier
    }

    getIdentifier() {
        return this.identifier
    }

    getType(): EventType {
        return EventType.RuntimeEvent
    }

}