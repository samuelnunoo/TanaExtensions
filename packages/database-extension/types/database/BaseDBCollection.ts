export default class BaseDBCollection {

    collection: string 

    constructor(collection:string) {
        this.collection = collection
    }

    getCollectionName() {
        return this.collection
    }


}