import BaseDBCollection from "./BaseDBCollection";
import DBCollectionEntry from "./DBCollectionEntry";

export default class DBCollection<K> extends BaseDBCollection {
    createInstance(nodeId:string,content:K) {
        return new DBCollectionEntry<K>(this.collection,nodeId,content)
    }
}


