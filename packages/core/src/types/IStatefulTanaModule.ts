import ITanaExtension from "./ITanaExtension";


export default interface IStatefulTanaModule {
    init: () => Promise<boolean>
}

