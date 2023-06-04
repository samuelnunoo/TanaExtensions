
(async function() {
    const chromeApi = await import("./ChromeApi")
    chromeApi.ChromeTask
    window.addEventListener('myCustomEvent', function(event) {
        console.log("I heard it")
        chromeApi.sendEventToBackground(event)
    });
})()

