import BaseDBCollection from "./BaseDB";

export default class DBCollectionEntry<T> extends BaseDBCollection {
    nodeId:string;
    content:T 

    constructor(collection:string,nodeId:string,content:T) {
        super(collection)
        this.nodeId = nodeId
        this.content = content 
    }

    getContent() {
        return this.content 
    }

    getNodeId() {
        return this.nodeId
    }

    getMergedContent(otherContent:Partial<T>) {
        return {
            ...this.content,
            ...otherContent
        }
    }

}