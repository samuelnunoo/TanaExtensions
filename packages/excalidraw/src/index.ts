import TanaExtension from "tana-extensions-core/src/types/TanaExtension";
import { InitEvent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import { TanaPubSubComponent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import ExcalidrawNodeViewPublisher from "./ExcalidrawNodeViewPublisher";
import _ from "lodash";
import OnExcalidrawExtensionInitEvent from "../types/OnExcalidrawExtensionInitEvent"
import ExcalidrawStateHandler from "./ExcalidrawStateHandler";
import ExcalidrawNodeViewConfig from "./ExcalidrawNodeViewConfig";

export default class ExcalidrawExtension extends TanaExtension {
    nodeEventSubscriber = new ExcalidrawNodeViewPublisher(this,this.eventBus)
    private excalidrawStateHandler = new ExcalidrawStateHandler(this.eventBus)
    private excalidrawNodeViewConfig = new ExcalidrawNodeViewConfig(this.eventBus,this)

    getUniqueIdentifier(): string {
        return "TanaExcalidrawExtension"
    }

    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.nodeEventSubscriber
        ]
    }

    getEventModuleInvokesOnCompletion(): InitEvent {
        return OnExcalidrawExtensionInitEvent
    }

    getExcalidrawStateHandler() {
        return this.excalidrawStateHandler
    }

    getExcalidrawNodeViewConfig() {
        return this.excalidrawNodeViewConfig
    }
}