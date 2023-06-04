import {ChromeTask} from "./ChromeApi"
import { Codec, string,} from "purify-ts"

console.log("Background running")


const requestCodec = Codec.interface({
    command: string
})

chrome.runtime.onMessage.addListener(function(request:unknown, sender, sendResponse) {
    console.log("Received Message")
    requestCodec.decode(request)
    .map(validRequest => {
            switch(validRequest.command) {
                case ChromeTask.GetGoogleOAuth2Token:
                   return sendGoogleOAuth2Token()
                default:
                    return 
            }
    })
})


const sendGoogleOAuth2Token = () => {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        
        let init = {
          method: 'GET',
          async: true,
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          'contentType': 'json'
        }

        console.log(init)
    })
    

} 