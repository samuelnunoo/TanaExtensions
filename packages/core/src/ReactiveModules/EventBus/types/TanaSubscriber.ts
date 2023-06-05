import EventBus from "../index";
import {InitEvent} from "./Event";
import TanaPubSubModule, {TanaPubSubComponent} from "./TanaPubSubModule";
import RuntimeEventStatic from "./RuntimeEventStatic";
import RuntimeEventInstance from "./RuntimeEventInstance";

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

    subscribeToRuntimeEvent<T>(event:RuntimeEventStatic<T>, callback:(event:RuntimeEventInstance<T>) => void) {
        this.eventBus.subscribeToRuntimeEvent(event,callback)
    }

}