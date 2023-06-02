import ITanaExtension from "../../src/types/ITanaExtension";
import IRequest from "../../src/types/IRequest";


export default class MockExtension implements ITanaExtension {
    identitifer:number
    constructor(id:number) {
        this.identitifer = id
    }
    async handle(request: IRequest, handleNextRequest: (shouldContinue: boolean) => void): Promise<boolean> {
        console.log("Request", request)
        if (request.stop == this.identitifer)   {
            console.log("stopping propagation with id: ",this.identitifer)
            handleNextRequest(false)
        }
        else handleNextRequest(true)
        return true
    }

}