import BaseDBCollection from "./BaseDB";
import DBCollectionEntry from "./DBCollectionEntry";


export default class DBCollection<T> extends BaseDBCollection {

    createInstance(nodeId:string,content:T) {
        return new DBCollectionEntry<T>(this.collection,nodeId,content)
    }

}