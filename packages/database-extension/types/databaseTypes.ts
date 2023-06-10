import {NodeEventMessage} from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/NodeEvent";


export interface DBNode  {
    transactionId:number

    nodeId:string

    content:object


}

export enum TransactionMetaDataEnum {
    localDB = "localDB",
    remoteDB = "remoteDB"
}
export interface LatestTransactionMetadata {
    latest_transaction_id:number
    type:TransactionMetaDataEnum
}

export const INDEXED_DB_LATEST_TRANSACTION_DB_ID = 0
export const LATEST_SYNCED_TRANSACTION_DB_ID = 1
export const DB_NAME = "tana.db"
export const NODE_DB_COLLECTION = "node"

export const METADATA_DB_COLLECTION = "metadata"