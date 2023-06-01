import IStatefulTanaModule from "../types/IStatefulTanaModule";
import ITanaExtension from "../types/ITanaExtension";
import ITanaExtensionNotifier from "./types/ITanaExtensionNotifier";
import IRequest from "../types/IRequest";
import {Just, Maybe, MaybeAsync} from "purify-ts";


class BaseObserver<T> {
    public listeners:T[]

    constructor() {
        this.listeners = []
    }

    public addListener(listener:T) {
        console.log("Called the add listener method",listener)
        console.log("what is this",this)
        this.listeners.push(listener)
    }

    public removeListener(listener:T) {
        this.listeners = this.listeners.filter( listener => listener !== listener)
    }

}
export default class TanaExtensionNotifier extends BaseObserver<ITanaExtension>
    implements IStatefulTanaModule, ITanaExtensionNotifier {
    constructor() {
        super();
    }
    public async  init(extensions:ITanaExtension[]): Promise<boolean> {
        extensions.forEach(this.addListener.bind(this))
        return true
    }

    public onInitSuccess(extensions: ITanaExtension[]): Promise<boolean> {
        return Promise.resolve(false);
    }

    async notifyExtensions(request: IRequest) {
        await this.listeners.reduce((prevStatus:Promise<Maybe<boolean>>,currentExtension) => {
            return MaybeAsync.fromPromise(() => prevStatus)
                .filter(this.shouldProcessRequest)
                .extend(_ => this.notifyExtension(currentExtension,request))
                .run()
        },Promise.resolve(Just(true)))
    }

    private shouldProcessRequest(response:boolean) {
        return !!response
    }

    private async notifyExtension(currentExtension:ITanaExtension,request:IRequest) {
        return new Promise<Maybe<boolean>>(async (resolve) => {
            const processNextRequest = (shouldContinue:boolean) => resolve(Just(shouldContinue))
            await currentExtension.handle(request,processNextRequest)
        })
    }

}