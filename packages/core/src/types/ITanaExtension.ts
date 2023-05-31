import IRequest from "./IRequest";

export default interface ITanaExtension {
    handle(request:IRequest,handleNextRequest:(shouldContinue:boolean) => void): Promise<boolean>
}