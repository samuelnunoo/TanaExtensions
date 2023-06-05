export interface ChromeEvent extends CustomEvent {
    detail: {
       command:ChromeTask 
    }
}

export interface ChromeEventResponse<T> extends CustomEvent {
    detail: {
        response:T
        responseTo:ChromeTask
    }
}

export const sendEventToBackground = async (event:Event) => {
    console.log("got message")
   const response = await chrome.runtime.sendMessage({
        message: (event as ChromeEvent).detail
    })
    console.log(response)
    return response

}

export enum ChromeTask {
    GetGoogleOAuth2Token = "getGoogleOAuth2Token"
}