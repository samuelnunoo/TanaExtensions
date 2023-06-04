import ITanaExtension from "./TanaExtension";


export default interface IStatefulTanaModule {
    init: () => Promise<boolean>
}

