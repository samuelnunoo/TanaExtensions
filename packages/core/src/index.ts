import TanaModuleLoader from "./LifeCycleModules/TanaModuleLoader";
import TanaLifeCycleObserver from "./StatefulModules/Observers/TanaLifeCycleObserver";
import IStatefulTanaModule from "./types/IStatefulTanaModule";
import ITanaExtension from "./types/ITanaExtension";

export default class TanaMain {
    private static readonly modulesToLoadOnStart: IStatefulTanaModule[] = []
    private static readonly  modulesToLoadOnAppStateInit: IStatefulTanaModule[] = []
    private static readonly  modulesToLoadOnDomRenderComplete: IStatefulTanaModule[] = [

    ]

    public static async init(tanaExtensions:ITanaExtension[]) {
        const moduleLoader = new TanaModuleLoader(
            tanaExtensions,
            TanaMain.modulesToLoadOnStart,
            TanaMain.modulesToLoadOnAppStateInit,
            TanaMain.modulesToLoadOnDomRenderComplete
        )
        await new TanaLifeCycleObserver(moduleLoader).init()
    }

}
