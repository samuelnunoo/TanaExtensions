import IStatefulTanaModule from "./IStatefulTanaModule";


export default interface IRequest<T> {
    sender:IStatefulTanaModule
    message:T
}