import {InitEvent} from "./Event";
import EventBus from "../index";
import TanaPubSubModule, {TanaPubSubComponent} from "./TanaPubSubModule";

export default abstract class TanaPublisher<T extends TanaPubSubModule> implements TanaPubSubComponent {
    protected mediator: T
    dispatchRuntimeEvent: InstanceType<typeof EventBus>["dispatchRuntimeEvent"]

    protected constructor(mediator:T, dispatchRuntimeEvent: InstanceType<typeof EventBus>["dispatchRuntimeEvent"]) {
        this.mediator = mediator
        this.dispatchRuntimeEvent = dispatchRuntimeEvent
    }

    abstract getInitRequirements(): InitEvent[]

    abstract onInitComplete()
}