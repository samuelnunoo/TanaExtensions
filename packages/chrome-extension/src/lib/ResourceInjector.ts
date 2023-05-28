(function() {
    const script = document.createElement("script")
    script.src = chrome.runtime.getURL("lib/index.js")
    script.setAttribute("type","module")
    const css = document.createElement("link")
    css.href = chrome.runtime.getURL("assets/bundle.css")
    css.rel = "stylesheet"
    document.head.appendChild(script)
    document.head.appendChild(css)
})()
