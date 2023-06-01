import {ITanaNodeTransactionListener} from "./types/ITanaNodeTransactionListener";
import TanaStateProvider from "../TanaStateProvider";
import {ChangeRecord, TanaInfo} from "../TanaStateProvider/types/types";
import {ITanaExtension} from "../../LifeCycleModules/TanaExtensionInitializer/types";
import ITanaNodeTransactionObserver from "./types/ITanaNodeTransactionObserver";
import {ITanaStateProvider} from "../TanaStateProvider/types/ITanaStateProvider";
import {IStatefulTanaModule} from "../types";

/*
Module Use Case:
    The TanaNodeTransactionObserver allows you to observe the state of the DOM and
    invoke events based off of it.

 */
export default new class TanaNodeTransactionPublisher implements  ITanaNodeTransactionObserver, IStatefulTanaModule {
    private listeners: ITanaNodeTransactionListener[] = []

    public init() {
        TanaStateProvider.getAppState()
            .map(appState => appState.nodeSpace.subscribeToChanges(
                (idList,changeRecord,info) => {
                    this.invokeHandlers(idList,changeRecord,info)
                }
            ))
        return Promise.resolve(true)
    }

    public addListener(listener: ITanaNodeTransactionListener): void {
        this.listeners.push(listener)
    }

    public removeListener(listener: ITanaNodeTransactionListener): void {
        this.listeners = this.listeners.filter(l => l !== listener)
    }

    private invokeHandlers(idList:string[], changeRecord:ChangeRecord, info:TanaInfo): void {
        for (const listener of this.listeners) {
            listener.invokeNodeEvent(idList,changeRecord,info)
        }
    }

    onInitSuccess(extensions: ITanaExtension[]): Promise<boolean> {
        return Promise.resolve(false);
    }

}
