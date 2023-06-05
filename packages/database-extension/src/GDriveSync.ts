import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber";
import TanaDatabaseExtension from "./index";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";


export default class GDriveSync extends TanaSubscriber<TanaDatabaseExtension> {
    getInitRequirements(): InitEvent[] {
        return [];
    }

    onDependenciesInitComplete() {
    }


}