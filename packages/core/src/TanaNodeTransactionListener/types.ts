import {changeRecord, TanaInfo} from "../TanaStateProvider/types/types";

export interface INodeTransactionListener {
    invokeNodeEvent(idList:string[],changeRecord:changeRecord,info:TanaInfo):void
}
