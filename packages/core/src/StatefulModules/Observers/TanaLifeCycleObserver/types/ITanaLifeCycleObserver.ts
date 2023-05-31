import {IStatefulTanaModule} from "../../../../types";
import {ITanaExtension} from "../../../LifeCycleModules/TanaExtensionInitializer/types";
import ITanaLifeCycleListener from "./ITanaLifeCycleListener";


export default interface ITanaLifeCycleObserver {
    init():Promise<void>
}