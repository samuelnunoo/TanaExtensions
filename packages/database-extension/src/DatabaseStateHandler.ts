import  lokijs from "lokijs";
//@ts-ignore
import indexedDBAdapter from "lokijs/src/loki-indexed-adapter.js"
import { DBNode, LatestTransactionMetadata, TransactionMetaDataEnum } from "../types/databaseTypes";
import { Maybe } from "purify-ts";
import BaseDBCollection from "../types/BaseDB";
import DBCollectionEntry from "../types/DBCollectionEntry";
import DBCollection from '../types/DBCollection';

const DB_NAME = "tana.db"
const NODE_DB_COLLECTION = "node"
const METADATA_DB_COLLECTION = "metadata"


export default class DatabaseStateHandler {

    private database:lokijs|null  = null 

    public async init() {
        return new Promise((response) => {
            this.database = new lokijs(DB_NAME,{
                adapter : new indexedDBAdapter(DB_NAME),
                autoload: true,
                autoloadCallback : this.createInitialCollections(response),
                autosave: true,
                autosaveInterval: 4000
            })
        })
    }

    public updateLatestTransactionId(latest_transaction_id:number) {
        Maybe.fromNullable(this.database)
            .map(db => db.getCollection(METADATA_DB_COLLECTION))
            .map(metadataCollection => {
                const entry = metadataCollection.findOne({type:TransactionMetaDataEnum.localDB}) ||
                    metadataCollection.insert({ type:TransactionMetaDataEnum.localDB } as LatestTransactionMetadata)
                entry.latest_transaction_id = latest_transaction_id
                metadataCollection.update(entry)
            })
    }

    public getEntry<T>(baseCollection:DBCollection<T>,nodeId:string) {
        return Maybe.fromNullable(this.database)
            .map(database => database.getCollection<T>(baseCollection.getCollectionName()))
            .map(collection => collection.findOne({nodeId}) )
            .extractNullable()
    }

    public updateEntry<T>(newEntry:DBCollectionEntry<T>) {
        let currentEntry = this.getEntry(dbCollectionName,nodeId) as DBNode

        if (!currentEntry) {
            return this.insertEntry(dbCollectionName, nodeId, content)
        }

        const newContent = {...currentEntry.content,...content}
        currentEntry.content = newContent
                 
        Maybe.fromNullable(this.getDBCollection(dbCollectionName))
        .map(collection => collection.update(newContent))
    } 

    public getLatestTransactionId() {
        return Maybe.fromNullable(this.database)
            .map(db => db.getCollection(METADATA_DB_COLLECTION))
            .map(metadataCollection => metadataCollection.findOne({type:TransactionMetaDataEnum.localDB}))
            .map((transactionMetaData:LatestTransactionMetadata) =>  transactionMetaData.latest_transaction_id)
            .orDefault(0)
    }

    public createCollectionIfNotExists(collection:string) {
        Maybe.fromNullable(this.database)
            .map(database => {
                if (database.getCollection(collection)) return 
                database.addCollection(collection)
            })
    }

    private insertEntry(collectionName:string, nodeId:string, content:object) {
        Maybe.fromNullable(this.getDBCollection(collectionName))
            .map(collection => {
                const latestTransactionId = this.getLatestTransactionId()
                const dbEntry = {
                    transactionId: latestTransactionId + 1,
                    nodeId,
                    content 
                } as DBNode
    
                collection.insert(dbEntry)
                this.updateLatestTransactionId(latestTransactionId + 1)
            })
    }

    private getDBCollection(collectionName:string) {
        return Maybe.fromNullable(this.database)
        .map(database => database.getCollection(collectionName))
        .ifNothing(() => {throw Error(`Could not find Collection ${collectionName}`)})
        .extractNullable()
    } 

    private createInitialCollections(response) {
        return () => {
            Maybe.fromNullable(this.database)
            .map(database => {
                if (!database.getCollection(NODE_DB_COLLECTION)) {
                    database.addCollection(NODE_DB_COLLECTION);
                }

                if (!database.getCollection(METADATA_DB_COLLECTION)) {
                    database.addCollection(METADATA_DB_COLLECTION)
                    const metadata = database.getCollection(METADATA_DB_COLLECTION)
                    metadata.insert({type:TransactionMetaDataEnum.localDB,latest_transaction_id:0} as LatestTransactionMetadata)
                    metadata.insert({type:TransactionMetaDataEnum.remoteDB,latest_transaction_id:0 } as LatestTransactionMetadata)
                }
                response()
            } )
        }
    }
}