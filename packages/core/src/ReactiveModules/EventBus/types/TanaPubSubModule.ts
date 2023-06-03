import EventBus from "../index";
import {InitEvent} from "./Event";

export abstract class TanaPubSubComponent {
    abstract getInitRequirements(): InitEvent[]
    abstract onInitComplete()

}

export default abstract class TanaPubSubModule {
    protected eventBus:EventBus
    private isInitialized:boolean = false
    private dependencies:Set<string>= new Set()
    protected constructor(eventBus:EventBus) {
        this.eventBus = eventBus
        this.init()
    }

    public getInitStatus() {
        return this.isInitialized
    }

    abstract getPubSubComponents(): TanaPubSubComponent[]

    abstract getEventModuleInvokesOnCompletion():InitEvent

    private init() {
        const components = this.getPubSubComponents()
        components.forEach(component =>  this.register(component.getInitRequirements()))
    }

    private register(initEvents:InitEvent[]) {
        initEvents.forEach(initEvent => {
            this.dependencies.add(initEvent.getIdentifier())
            this.eventBus.subscribeToInitEvent(initEvent,this.acknowledgeDependencyHasInitialized)
        })
    }

    private async notifyComponentsOfInitCompletion() {
        for (const component of this.getPubSubComponents()) {
            component.onInitComplete()
        }
        this.eventBus.dispatchInitEvent(this.getEventModuleInvokesOnCompletion())
        this.isInitialized = true
    }

    private async acknowledgeDependencyHasInitialized(event:InitEvent) {
        this.dependencies.delete(event.getIdentifier())
        if (this.dependencies.size == 0) {
            await this.notifyComponentsOfInitCompletion()
        }
    }

}