import ITanaExtension from "../../src/types/ITanaExtension";
import IRequest from "../../src/types/IRequest";


export default class MockExtension implements ITanaExtension {
    async handle(request: IRequest, handleNextRequest: (shouldContinue: boolean) => void): Promise<boolean> {
        handleNextRequest(true)
        return true 
    }

}