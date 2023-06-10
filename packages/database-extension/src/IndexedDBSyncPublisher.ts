import TanaPublisher from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPublisher";
import TanaDatabaseExtension from "./index";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";

export default class IndexedDBSyncPublisher extends TanaPublisher<TanaDatabaseExtension> {
    getInitRequirements(): InitEvent[] {
        return [];
    }

    onDependenciesInitComplete() {

    }

}