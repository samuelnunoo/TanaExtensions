import TanaPublisher from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPublisher";
import ExcalidrawExtension from ".";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import RegisterNodeViewEvent from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/events/RegisterNodeViewEvent";
import OnDatabaseInitEvent from "database-extension/types/events/OnDatabaseInitEvent";
import NodeRelacementPublisherInitEvent from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/events/NodeReplacementPublisherInitEvent"

export default class ExcalidrawNodeViewPublisher extends TanaPublisher<ExcalidrawExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnDatabaseInitEvent,
            NodeRelacementPublisherInitEvent
        ]
    }

    onDependenciesInitComplete() {
        const event = RegisterNodeViewEvent.createInstance({
            templateId:"excalidraw-extension",
            config: this.mediator.getExcalidrawNodeViewConfig()
        })

        this.dispatchRuntimeEvent(event)
    }

}