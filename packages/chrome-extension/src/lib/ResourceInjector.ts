(async function() {
    const script = document.createElement("script")
    script.src = chrome.runtime.getURL("lib/index.js")
    script.setAttribute("type","module")
    const css = document.createElement("link")
    css.href = chrome.runtime.getURL("assets/bundle.assets")
    css.rel = "stylesheet"
    const script2 = document.createElement("script")
    script2.src = chrome.runtime.getURL("lib/LoadDependencies.js")
    document.head.appendChild(script2)
    document.head.appendChild(script)
    document.head.appendChild(css)
})()
