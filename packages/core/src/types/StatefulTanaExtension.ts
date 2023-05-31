import BaseTanaExtension from "./ISomething";
import IRequest from "./IRequest";
import {Maybe, MaybeAsync} from "purify-ts";

export default abstract class StatefulTanaExtension extends BaseTanaExtension {
    abstract initializationIsComplete():boolean
    abstract requestContainsInitRequirement(request:IRequest): boolean
    abstract registerInitComponent(request:IRequest):Promise<void>
    handle(request: IRequest, nextHandler: (continueToNextHandler: boolean) => boolean) {
        MaybeAsync.liftMaybe(Maybe.fromFalsy(!this.initializationIsComplete()))
            .map((_) => this.shouldBlockUntilComplete() || nextHandler(true))
            .map((_) => this.requestContainsInitRequirement(request))
            .map((_) => this.registerInitComponent(request))
            .orDefault(super.handlerequest,nextHandler)
            )

            .finally(() => super.handle(request,nextHandler))
    }
}