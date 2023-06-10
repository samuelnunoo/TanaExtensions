import RuntimeEventInstance from "./RuntimeEventInstance";

export enum EventType {
    InitEvent,
    RuntimeEvent
}

export interface BaseEvent {
    getIdentifier():string
    getType():EventType
}


export type GenericEventCallback = (event:BaseEvent) => void

export type InitEventCallback = (event:InitEvent) => void

export abstract class InitEvent implements BaseEvent {
    abstract getIdentifier():string
    getType() {
        return EventType.InitEvent
    }
}