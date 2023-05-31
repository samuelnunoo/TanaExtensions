import {INodeTransactionListener} from "./types";
import TanaStateProvider from "../TanaStateProvider";
import {changeRecord, TanaInfo} from "../TanaStateProvider/types/types";
import {ITanaExtension} from "../TanaExtensionInitializer/types";

/*
Module Use Case:
    The TanaNodeTransactionListener allows you to observe the state of the DOM and
    invoke events based off of it.

 */
export default new class TanaNodeTransactionListener {
    private listeners: INodeTransactionListener[] = []
    private subscription:any

    public init(): void {
        if (!!this.subscription) return
        this.subscription = TanaStateProvider.getAppState()
            .nodeSpace
            .subscribeToChanges(
                (idList,changeRecord,info) => {
                    this.invokeHandlers(idList,changeRecord,info)
                })
    }

    public addListener(listener: INodeTransactionListener): void {
        this.listeners.push(listener)
    }
    public removeListener(listener: INodeTransactionListener): void {
        this.listeners = this.listeners.filter(l => l !== listener)
    }
    private invokeHandlers(idList:string[],changeRecord:changeRecord,info:TanaInfo): void {
        for (const listener of this.listeners) {
            listener.invokeNodeEvent(idList,changeRecord,info)
        }
    }

}
