import {BaseEvent, GenericEventCallback, InitEvent, InitEventCallback} from "./types/Event";
import {Maybe} from "purify-ts";
import RuntimeEventInstance from "./types/RuntimeEventInstance";
import RuntimeEventStatic from "./types/RuntimeEventStatic";

export default class EventBus {
    private subscribers: Map<string,GenericEventCallback[]> = new Map()
    private requests: Map<RuntimeEventInstance<any>,(response:any) => any> = new Map()

    constructor() {
        this.dispatchInitEvent = this.dispatchInitEvent.bind(this)
        this.dispatchRuntimeEvent = this.dispatchRuntimeEvent.bind(this)
        this.subscribeToRuntimeEvent = this.subscribeToRuntimeEvent.bind(this)
        this.subscribeToInitEvent = this.subscribeToInitEvent.bind(this)
    }


    public dispatchEventAndAWaitFirstReply<T>(runtimeEvent:RuntimeEventInstance<T>,secondsToWait:number) {
        return new Promise((resolve,reject) => {
            this.requests.set(runtimeEvent,resolve)
            this.dispatchEvent(runtimeEvent)
            setTimeout(() => { reject("No Response in Time")}, secondsToWait * 1000)
        })
    }

    public dispatchEventResponse<T>(originalEvent:RuntimeEventInstance<any>,responseEvent:RuntimeEventInstance<T>) {
        Maybe.fromNullable(this.requests.get(originalEvent))
            .map(resolve => resolve(responseEvent))
            .map( _ => this.requests.delete(originalEvent))
    }

    public dispatchInitEvent(event:InitEvent) {

        this.dispatchEvent(event)
    }

    public dispatchRuntimeEvent<T>(runtimeEvent:RuntimeEventInstance<T>) {
        this.dispatchEvent(runtimeEvent)
    }

    public subscribeToInitEvent(event:InitEvent,callback:InitEventCallback) {
        this.subscribe(event,callback)
    }

    public subscribeToRuntimeEvent<T>(event:RuntimeEventStatic<T>,callback:(event:RuntimeEventInstance<T>) => void) {
        this.subscribe(event,callback as (event:BaseEvent) => void)
    }

    public unsubscribe(event:BaseEvent,callback:GenericEventCallback) {
        Maybe.fromFalsy(this.subscribers.has(event.getIdentifier()))
            .map( _ => this.subscribers.get(event.getIdentifier())!.filter(c => c!== callback))
            .map(filteredCallbacks => this.subscribers.set(event.getIdentifier(),filteredCallbacks))
    }

    private dispatchEvent(event:BaseEvent) {
        Maybe.fromNullable(this.subscribers.get(event.getIdentifier()))
            .map(callbacks => callbacks.forEach(callback => callback(event)))
    }

    private subscribe(event:BaseEvent,callback:GenericEventCallback) {
        Maybe.of(this.subscribers.has(event.getIdentifier()) || this.subscribers.set(event.getIdentifier(),[]))
            .chain( _ => Maybe.of(this.subscribers.get(event.getIdentifier()) as GenericEventCallback[]))
            .map( callbacks => callbacks.push(callback))
    }
}