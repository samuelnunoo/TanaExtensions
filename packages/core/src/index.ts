import TanaLoaderModule from "./ReactiveModules/TanaLoaderModule";
import EventBus from "./ReactiveModules/EventBus";
import TanaPubSubModule from "./ReactiveModules/EventBus/types/TanaPubSubModule";
import TanaDomNodeEventModule from "./ReactiveModules/TanaNodeEventModule";
import TanaPanelEventModule from "./ReactiveModules/TanaPanelEventModule";
import OnMainInitEvent from "./types/OnMainInitEvent";
import TanaExtension from "./types/TanaExtension";
import "../assets/default.css"
import TanaNodeViewModule from "./ReactiveModules/TanaNodeViewModule";
import TanaDragDropModule from "./ReactiveModules/TanaDragDropModule";
/*
Module Responsibility
    This module is responsible for initializing the tana extension
    functionality.
 */

export default class TanaMain {
    eventBus:EventBus
    moduleExtensions: TanaExtension[]
    coreModules: TanaPubSubModule[]
    
    constructor(tanaExtensionWrapper: (eventBus:EventBus) => TanaExtension[]) {
        console.log("Loading Extension...")
        this.eventBus = new EventBus()
        this.coreModules =  [
            new TanaLoaderModule(this.eventBus) as TanaPubSubModule,
            new TanaDomNodeEventModule(this.eventBus) as TanaPubSubModule,
            new TanaPanelEventModule(this.eventBus) as TanaPubSubModule,
            new TanaNodeViewModule(this.eventBus) as TanaPubSubModule,
            new TanaDragDropModule(this.eventBus) as TanaPubSubModule,
        ]
        this.moduleExtensions = tanaExtensionWrapper(this.eventBus)
        this.init()
    }

    private init() {
        this.coreModules.forEach(module => module.init())
        this.moduleExtensions.forEach(module => module.init())
        this.eventBus.dispatchInitEvent(OnMainInitEvent)
    }
}
