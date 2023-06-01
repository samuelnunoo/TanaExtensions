import ITanaLifeCycleListener from "./types/ITanaLifeCycleListener";
import TanaLoader from "../TanaLoader";
import ITanaLifeCycleObserver from "./types/ITanaLifeCycleObserver";

export default class TanaLifeCycleObserver implements ITanaLifeCycleObserver {
    private moduleLoader: ITanaLifeCycleListener
    constructor(moduleLoader:ITanaLifeCycleListener) {
        this.moduleLoader = moduleLoader
    }
    public async init() {
        await this.invokeOnStart()
        await TanaLoader.waitForFieldToInstantiate(window,"appState")
        await this.invokeOnAppStateInitialized()
        await TanaLoader.waitForPageDomToCompletInitialization()
        await this.invokeOnDomRenderComplete()
    }
    private async invokeOnStart() {
        await this.moduleLoader.onStart()
    }

    private async invokeOnAppStateInitialized() {
        await this.moduleLoader.onAppStateInitialized()
    }

    private async invokeOnDomRenderComplete(){
        await this.moduleLoader.onDomRenderComplete()
    }
}




