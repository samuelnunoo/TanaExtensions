import ITanaExtension from "../../src/types/ITanaExtension";
import IRequest from "../../src/types/IRequest";


export default class MockExtension implements ITanaExtension {
    async handle(request: IRequest, handleNextRequest: (shouldContinue: boolean) => void): Promise<boolean> {
        console.log("Request", request)
        if (request.stop == true)   handleNextRequest(false)
        else handleNextRequest(true)
        return true
    }

}