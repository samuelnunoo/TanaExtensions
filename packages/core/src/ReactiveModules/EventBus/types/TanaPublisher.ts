import {InitEvent} from "./Event";
import EventBus from "../index";
import TanaPubSubModule, {TanaPubSubComponent} from "./TanaPubSubModule";
import RuntimeEvent from "./RuntimeEvent";
import RuntimeEventInstance from "./RuntimeEventInstance";

export default abstract class TanaPublisher<T extends TanaPubSubModule> implements TanaPubSubComponent {
    protected mediator: T

    private eventBus:EventBus

    constructor(mediator:T, eventBus:EventBus) {
        this.mediator = mediator
        this.eventBus = eventBus
        this.dispatchRuntimeEvent = this.dispatchRuntimeEvent.bind(this)
    }

    abstract getInitRequirements(): InitEvent[]

    abstract onInitComplete()


    dispatchRuntimeEvent<T>(event:RuntimeEventInstance<T>) {
        this.eventBus.dispatchRuntimeEvent(event)
    }
}