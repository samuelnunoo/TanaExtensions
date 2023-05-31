import {ITanaNodeTransactionListener} from "./ITanaNodeTransactionListener";


export default interface ITanaNodeTransactionObserver {
    addListener(listener:ITanaNodeTransactionListener): void

    removeListener(listener: ITanaNodeTransactionListener): void

}