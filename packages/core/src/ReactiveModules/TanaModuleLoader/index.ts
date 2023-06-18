import {InitEvent} from "../EventBus/types/Event";
import TanaPubSubModule, {TanaPubSubComponent} from "../EventBus/types/TanaPubSubModule";
import OnTanaModuleLoaderInitEvent from "./types/OnTanaModuleLoaderInitEvent";
import TanaLifeCycleEventPublisher from "./TanaLifeCycleEventPublisher";
import OnStartEvent from "./types/OnStartEvent";
import OnAppStateInitEvent from "./types/OnAppStateInitEvent";
import OnDomRenderCompleteEvent from "./types/OnDomRenderCompleteEvent";
import EventBus from "../EventBus";

/*
Module Responsibility:
    This module is responsible for loading the core Tana modules at
    their appropriate point in the lifecycle.
 */

export default class TanaModuleLoader extends TanaPubSubModule {

    constructor(eventBus:EventBus) {
        console.log("Running Tana Module Loader")
        super(eventBus);
    }

    TanaLifeCycleEventPublisher = new TanaLifeCycleEventPublisher(this,this.eventBus)

    getEventModuleInvokesOnCompletion(): InitEvent {
        return OnTanaModuleLoaderInitEvent;
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.TanaLifeCycleEventPublisher
        ];
    }
    
    invokeOnStart() {
        this.eventBus.dispatchInitEvent(OnStartEvent)
    }

    onAppStateInitialized() {
        this.eventBus.dispatchInitEvent(OnAppStateInitEvent)
    }

    onDomRenderComplete() {
        this.eventBus.dispatchInitEvent(OnDomRenderCompleteEvent)
    }

}