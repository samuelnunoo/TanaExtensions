import {BaseEvent, EventType} from "./Event";


export default class RuntimeEvent implements BaseEvent {
    protected identifier:string

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