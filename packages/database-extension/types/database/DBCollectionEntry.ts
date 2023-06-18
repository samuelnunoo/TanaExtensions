import BaseDBCollection from "./BaseDBCollection";
import DBNode from "./DBNode";

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

    getDBNodeData() {
        return {
            nodeId:this.nodeId,
            content:this.content
        } as DBNode<T>
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