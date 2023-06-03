import TanaModuleLoader from "./ReactiveModules/TanaModuleLoader";
import TanaLifeCycleObserver from "./ReactiveModules/TanaLifeCycleObserver";
import IStatefulTanaModule from "./types/IStatefulTanaModule";
import ITanaExtension from "./types/ITanaExtension";
import TanaExtensionNotifier from "./ReactiveModules/TanaExtensionNotifier";
import EventBus from "./ReactiveModules/EventBus";

/*
Module Responsibility
    This module is responsible for initializing the tana extension
    functionality.
 */
export default class TanaMain {
    eventBus:EventBus
    tanaExtensions: ITanaExtension[]
    constructor(tanaExtensionWrapper: (eventBus:EventBus) => ITanaExtension[]) {
        this.eventBus = new EventBus()
        this.tanaExtensions = tanaExtensionWrapper(this.eventBus)
    }

    public async init() {
        new TanaModuleLoader(this.eventBus)
        /*
        TanaModuleLoader
        TanaDomNodeEventPublisher
        TanaDomPanelEventPublisher
        TanaModuleLoader
        TanaNodeTransactionPublisher

         */
    }

}
