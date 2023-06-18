import  lokijs from "lokijs";
//@ts-ignore
import indexedDBAdapter from "lokijs/src/loki-indexed-adapter.js"
import LatestTransactionMetadata, {TransactionMetaDataEnum } from "../types/database/LatestTransactionMetadata";
import { Maybe } from "purify-ts";
import DBCollectionEntry from "../types/database/DBCollectionEntry";
import DBCollection from '../types/database/DBCollection';
import DBNode from "../types/database/DBNode";

const DB_NAME = "tana.db"
const NODE_DB_COLLECTION = "node"
const METADATA_DB_COLLECTION = "metadata"

/*
This module is responsible for providing access to
data within the database
 */
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

    public getEntry<T>(dbCollection:DBCollection<T>,nodeId:string) {
        const node = this.getLokiNode(dbCollection,nodeId)
        if (!node) return null
        return dbCollection.createInstance(nodeId,node.content)
    }

    public updateEntry<T>(dbCollection:DBCollection<T>,nodeId:string,content:T) {
        let currentEntry = this.getLokiNode(dbCollection,nodeId)

        if (!currentEntry) {
            return this.insertEntry(dbCollection.createInstance(nodeId,content))
        }

        const newContent = {...currentEntry.content,...content}
        currentEntry.content = newContent
                 
        Maybe.fromNullable(this.getDBCollection(dbCollection.getCollectionName()))
        .map(collection => collection.update(currentEntry!))
    } 

    public createCollectionIfNotExists<T>(collection:DBCollection<T>) {
        Maybe.fromNullable(this.database)
            .map(database => {
                if (database.getCollection(collection.getCollectionName())) return
                database.addCollection(collection.getCollectionName())
            })
    }

    private insertEntry<T>(dbEntry: DBCollectionEntry<T>) {
        Maybe.fromNullable(this.getDBCollection(dbEntry.getCollectionName()))
            .map(collection => {
                collection.insert(dbEntry.getDBNodeData())
            })
    }

    private getDBCollection<T>(collectionName:string) {
        return Maybe.fromNullable(this.database)
        .map(database => database.getCollection<DBNode<T>>(collectionName))
        .ifNothing(() => {throw Error(`Could not find Collection ${collectionName}`)})
        .extractNullable()
    } 

    private getLokiNode<T>(dbCollection:DBCollection<T>,nodeId:string) {
       return Maybe.fromNullable(this.database)
            .map(database => database.getCollection<DBNode<T>>(dbCollection.getCollectionName()))
            .map(collection => collection.findOne({'nodeId': {"$eq": nodeId}}))
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