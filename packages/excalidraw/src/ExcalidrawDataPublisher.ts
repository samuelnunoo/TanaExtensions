import TanaPublisher from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPublisher";
import ExcalidrawExtension from "./index";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import OnDatabaseInitEvent from "database-extension/types/OnDatabaseInitEvent";


export default class ExcalidrawDataPublisher extends TanaPublisher<ExcalidrawExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnDatabaseInitEvent
        ];
    }

    onDependenciesInitComplete() {

    }



}