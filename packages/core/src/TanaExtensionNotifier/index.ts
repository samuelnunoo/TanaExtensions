import IStatefulTanaModule from "../types/IStatefulTanaModule";
import ITanaExtension from "../types/ITanaExtension";
import BaseObserver from "../StatefulModules/Observers/BaseObserver";
import ITanaExtensionNotifier from "./types/ITanaExtensionNotifier";
import IRequest from "../types/IRequest";
import {Just, MaybeAsync, Nothing} from "purify-ts";

export default new class TanaExtensionNotifier extends BaseObserver<ITanaExtension>
    implements IStatefulTanaModule, ITanaExtensionNotifier {

    async init(extensions:ITanaExtension[]): Promise<boolean> {
        extensions.forEach(super.addListener)
        return true
    }


    onInitSuccess(extensions: ITanaExtension[]): Promise<boolean> {
        return Promise.resolve(false);
    }

    async notifyExtensions(request: IRequest) {
        await super.listeners.reduce(async (prevStatus,currentExtension) => {
            return prevStatus
                .filter((shouldContinue) => shouldContinue == true)
                .map(_ => this.notifyExtension(currentExtension,request))
        },MaybeAsync.liftMaybe(Just(true)))
    }

    private async notifyExtension(currentExtension:ITanaExtension,request:IRequest) {
        return new Promise<boolean>(async (resolve) => {
            const processNextRequest = (shouldContinue:boolean) => resolve(shouldContinue)
            await currentExtension.handle(request,processNextRequest)
        })
    }

}