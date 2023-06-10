import EventBus from "../index";
import {InitEvent} from "./Event";
import TanaPubSubModule, {TanaPubSubComponent} from "./TanaPubSubModule";
import RuntimeEventStatic from "./RuntimeEventStatic";
import RuntimeEventInstance from "./RuntimeEventInstance";
import RuntimeEvent from "./RuntimeEvent";

export default abstract class TanaSubscriber<T extends TanaPubSubModule> implements TanaPubSubComponent {
    mediator: T

    eventBus:EventBus

    constructor(mediator: T, eventBus:EventBus) {
        this.mediator = mediator
        this.eventBus = eventBus
        this.subscribeToRuntimeEvent = this.subscribeToRuntimeEvent.bind(this)
    }

    abstract getInitRequirements(): InitEvent[]

    abstract onDependenciesInitComplete()

    public subscribeToRuntimeEvent<T>(event:RuntimeEventStatic<T>, callback:(event:RuntimeEventInstance<T>) => void) {
        this.eventBus.subscribeToRuntimeEvent(event,callback)
    }

    public async dispatchEventAndAWaitFirstReply<T>(runtimeEvent:RuntimeEventInstance<T>,secondsToWait:number) {
        return this.eventBus.dispatchEventAndAWaitFirstReply(runtimeEvent,secondsToWait)
    }
    public dispatchEventResponse<T>(originalEvent:RuntimeEventInstance<any>,responseEvent:RuntimeEventInstance<T>) {
        this.eventBus.dispatchEventResponse(originalEvent,responseEvent)
    }

}