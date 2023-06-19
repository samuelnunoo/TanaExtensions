import { InitEvent } from "../EventBus/types/Event";
import TanaPubSubModule, { TanaPubSubComponent } from "../EventBus/types/TanaPubSubModule";
import DragEventPublisher from "./DragEventPublisher";
import DragStateHandler from "./DragStateHandler";
import DragEventPublisherInit from "./types/DragEventPublisherInit";


export default class TanaDragEventPublisher extends TanaPubSubModule {
    private dragStateHandler:DragStateHandler = new DragStateHandler()
    private dragEventPublisher:DragEventPublisher = new DragEventPublisher(this,this.eventBus,document)

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.dragEventPublisher
        ]
    }
    
    getEventModuleInvokesOnCompletion(): InitEvent {
        return DragEventPublisherInit
    }

    getDragStateHandler() {
        return this.dragStateHandler
    }

}