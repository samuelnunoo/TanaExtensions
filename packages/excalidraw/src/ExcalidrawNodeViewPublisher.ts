import TanaPublisher from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPublisher";
import ExcalidrawExtension from ".";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import RegisterNodeViewEvent from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/events/RegisterNodeViewEvent";
import OnDatabaseInitEvent from "database-extension/types/events/OnDatabaseInitEvent";
import NodeRelacementPublisherInitEvent from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/events/NodeReplacementPublisherInitEvent"
import CreateCollectionEvent from 'database-extension/types/events/CreateCollectionEvent';
import ExcalidrawDBCollection from "./ExcalidrawDBCollection";

export default class ExcalidrawNodeViewPublisher extends TanaPublisher<ExcalidrawExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnDatabaseInitEvent,
            NodeRelacementPublisherInitEvent
        ]
    }

    onDependenciesInitComplete() {
        this.registerExcalidrawAsNodeView();
        this.createExcalidrawDBCollection();
    }


    private createExcalidrawDBCollection() {
        const event = CreateCollectionEvent.createInstance({ collection: ExcalidrawDBCollection });
        this.dispatchRuntimeEvent(event);
    }

    private registerExcalidrawAsNodeView() {
        const event = RegisterNodeViewEvent.createInstance({
            templateId: "excalidraw-extension",
            config: this.mediator.getExcalidrawNodeViewConfig()
        });

        this.dispatchRuntimeEvent(event);
    }
}