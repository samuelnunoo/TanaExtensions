import {ChangeRecord, TanaInfo} from "../../TanaStateProvider/types/types";

export interface ITanaNodeTransactionListener {
    invokeNodeEvent(idList:string[], changeRecord:ChangeRecord, info:TanaInfo):void
}
