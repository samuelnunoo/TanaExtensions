
(async function() {
    const chromeApi = await import("./ChromeApi")
    window.addEventListener('myCustomEvent', async function(event) {
        console.log("I heard it")
        const response = await chromeApi.sendEventToBackground(event)
        console.log(response)
    });


})()

