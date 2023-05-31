import {ITanaExtension} from "./TanaExtensionInitializer/types";

export interface ITanaModule {
    init: () => Promise<boolean>
    onInitSuccess: (extensions:ITanaExtension[]) => Promise<boolean>
}

