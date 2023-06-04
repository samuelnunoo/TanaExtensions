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

export const sendEventToBackground = (event:Event) => {
    chrome.runtime.sendMessage((event as ChromeEvent).detail)
}

export enum ChromeTask {
    GetGoogleOAuth2Token = "getGoogleOAuth2Token"
}