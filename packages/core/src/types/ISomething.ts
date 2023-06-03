import IRequest from "./IRequest";
import {Maybe, MaybeAsync, Nothing} from "purify-ts";


export default abstract class BaseTanaExtension {

    abstract shouldBlockUntilComplete():boolean
    abstract handleRequest(request:IRequest):Promise<boolean>
    abstract shouldHandleRequest(request:IRequest):boolean

    abstra
    handle(request:IRequest,nextHandler:(continueToNextHandler:boolean) => boolean) {
        Maybe.fromFalsy(this.shouldHandleRequest(request))
            .map((_) => this.shouldBlockUntilComplete() || nextHandler(true))
            .orDefault(nextHandler(true))
    }

}