import EventBus from "../index";
import {InitEvent} from "./Event";
import TanaPubSubModule, {TanaPubSubComponent} from "./TanaPubSubModule";

export default abstract class TanaSubscriber<T extends TanaPubSubModule> implements TanaPubSubComponent {
    mediator: T
    subscribeToRuntimeEvent: InstanceType<typeof EventBus>["subscribeToRuntimeEvent"]

    protected constructor(mediator: T, subscribeToRuntimeEvent: InstanceType<typeof EventBus>["subscribeToRuntimeEvent"]) {
        this.mediator = mediator
        this.subscribeToRuntimeEvent = subscribeToRuntimeEvent
    }

    abstract getInitRequirements(): InitEvent[]

    abstract onInitComplete()

}