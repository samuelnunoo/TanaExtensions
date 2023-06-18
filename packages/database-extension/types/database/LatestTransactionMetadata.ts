export enum TransactionMetaDataEnum {
    localDB = "localDB",
    remoteDB = "remoteDB"
}

export default interface LatestTransactionMetadata {
    latest_transaction_id:number
    type:TransactionMetaDataEnum
}
