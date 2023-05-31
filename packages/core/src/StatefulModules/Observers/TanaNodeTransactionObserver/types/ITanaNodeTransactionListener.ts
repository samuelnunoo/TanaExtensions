import {ChangeRecord, TanaInfo} from "../../../../DataProviders/TanaStateProvider/types/types";

export interface ITanaNodeTransactionListener {
    invokeNodeEvent(idList:string[], changeRecord:ChangeRecord, info:TanaInfo):void
}
