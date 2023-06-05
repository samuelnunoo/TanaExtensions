import {ChromeTask} from "./ChromeApi"
import { Codec, string,} from "purify-ts"
console.log("Background running")

const command = Codec.interface({
    command: string
})
const requestCodec = Codec.interface({
    message: command
})

chrome.runtime.onMessage.addListener( function(request:unknown, sender:any, sendResponse:any){
    console.log("Received Message")
    processRequest(request).then(sendResponse)
    // see https://stackoverflow.com/questions/48107746/chrome-extension-message-not-sending-response-undefined
    return true
})

const processRequest = async (request:unknown) => {
    return requestCodec.decode(request)
        .map(async validRequest => {
            switch(validRequest.message.command) {
                case ChromeTask.GetGoogleOAuth2Token:
                    return await sendGoogleOAuth2Token()
                default:
                    return {}
            }
        })
        .orDefault(Promise.resolve({}))
}

const sendGoogleOAuth2Token = async () => {
  return await new Promise<{tokenData:string|undefined}>((res) => {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            res({tokenData:token})
        })
    })
} 