import autoBind from "auto-bind"
import EventBus from ".."


export default abstract class TanaModuleComponent<T> {
    private eventBus:EventBus 
    private mediator:T

    constructor(eventBus:EventBus, mediator:T) {
        this.eventBus = eventBus 
        this.mediator = mediator
        autoBind(this)
    }

    getEventBus() {
        return this.eventBus
    }


    getMediator() {
        return this.mediator 
    }
}