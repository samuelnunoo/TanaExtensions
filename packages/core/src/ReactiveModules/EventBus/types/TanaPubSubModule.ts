import EventBus from "../index";
import {InitEvent} from "./Event";

export abstract class TanaPubSubComponent {
    abstract getInitRequirements(): InitEvent[]
    abstract onDependenciesInitComplete()
}

export default abstract class TanaPubSubModule {
    protected eventBus:EventBus
    private isInitialized:boolean = false
    private dependencies:Set<string>= new Set()
    constructor(eventBus:EventBus) {
        this.eventBus = eventBus
    }

    public getInitStatus() {
        return this.isInitialized
    }

    abstract getPubSubComponents(): TanaPubSubComponent[]

    abstract getEventModuleInvokesOnCompletion():InitEvent

    public init() {
        console.log(`Initializing ${this}...`)
        const components = this.getPubSubComponents()
        components.forEach(component =>  this.register(component.getInitRequirements()))
    }

    private register(initEvents:InitEvent[]) {
        initEvents.forEach(initEvent => {
            this.dependencies.add(initEvent.getIdentifier())
            this.eventBus.subscribeToInitEvent(initEvent,this.acknowledgeDependencyHasInitialized.bind(this))
        })
    }

    private async notifyComponentsThatDependenciesHaveInitialized() {
        const components = this.getPubSubComponents()
        for (const component of components) {
            await component.onDependenciesInitComplete()
        }
        this.eventBus.dispatchInitEvent(this.getEventModuleInvokesOnCompletion())
        console.log(`${this.constructor.name} has Initialized...`)
        this.isInitialized = true
    }

    private acknowledgeDependencyHasInitialized(event:InitEvent) {
        this.dependencies.delete(event.getIdentifier())
        if (this.dependencies.size == 0 && !this.isInitialized) {
            this.isInitialized = true 
            this.notifyComponentsThatDependenciesHaveInitialized()
        }
    }

}