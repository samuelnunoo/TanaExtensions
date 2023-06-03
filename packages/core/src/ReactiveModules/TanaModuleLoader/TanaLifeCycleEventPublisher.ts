import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import OnMainInitEvent from "../../OnMainInitEvent";
import TanaLoader from "../../StaticModules/TanaLoader";
import TanaModuleLoader from "./index";

export default class TanaLifeCycleEventPublisher extends TanaPublisher<TanaModuleLoader> {
    getInitRequirements(): InitEvent[] {
        return [OnMainInitEvent];
    }

    async onInitComplete() {
        this.mediator.invokeOnStart()
        await TanaLoader.waitForFieldToInstantiate(window,"appState")
        this.mediator.onAppStateInitialized()
        await TanaLoader.waitForPageDomToCompleteInitialization(document)
        this.mediator.onDomRenderComplete()
    }





}