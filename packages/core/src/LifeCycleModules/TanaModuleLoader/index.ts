import ITanaLifeCycleListener from "../../StatefulModules/Observers/TanaLifeCycleObserver/types/ITanaLifeCycleListener";
import ITanaExtension from "../../types/ITanaExtension";
import IStatefulTanaModule from "../../types/IStatefulTanaModule";


export default class TanaModuleLoader implements ITanaLifeCycleListener {

    private readonly tanaExtensions:ITanaExtension[]
    private readonly modulesToLoadOnStart:IStatefulTanaModule[]
    private readonly modulesToLoadOnAppStateInit: IStatefulTanaModule[]
    private readonly modulesToLoadOnDomRenderComplete: IStatefulTanaModule[]
    constructor(tanaExtensions:ITanaExtension[],
                modulesToLoadOnStart:IStatefulTanaModule[],
                modulesToLoadOnAppStateInit:IStatefulTanaModule[],
                modulesToLoadOnDomRenderComplete:IStatefulTanaModule[]
                ) {
        this.tanaExtensions = tanaExtensions
        this.modulesToLoadOnStart = modulesToLoadOnStart
        this.modulesToLoadOnAppStateInit = modulesToLoadOnAppStateInit
        this.modulesToLoadOnDomRenderComplete = modulesToLoadOnDomRenderComplete
    }

    async onStart(): Promise<void> {
        console.log("Tana Module Loader has Started")
        await this.loadModules(this.modulesToLoadOnStart)
    }
    async onAppStateInitialized(): Promise<void> {
        console.log("AppState Loaded")
        await this.loadModules(this.modulesToLoadOnAppStateInit)
    }

    async onDomRenderComplete(): Promise<void> {
        console.log("Dom has fully loaded")
        await this.loadModules(this.modulesToLoadOnDomRenderComplete)
    }

    private async loadModules(modules:IStatefulTanaModule[]) {
        await modules.reduce(async (prev,current) => {
            await prev
            return new Promise(async (res) => {
                const initSucceeded = await current.init()
                if (initSucceeded) await current.onInitSuccess(this.tanaExtensions)
                res()
            })
        }, Promise.resolve())
    }

}