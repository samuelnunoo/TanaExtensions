import ITanaExtension from "./ITanaExtension";


export default interface IStatefulTanaModule {
    init: (extensions:ITanaExtension[]) => Promise<boolean>
    onInitSuccess: (extensions:ITanaExtension[]) => Promise<boolean>
}

