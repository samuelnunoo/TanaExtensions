import TanaMain from "tana-extensions-core/src";
import Extensions from "./extensions"
const injectResources = (scriptSrc:string,cssHref:string) => {
    console.log("Injecting resources to page...")
    const script = document.createElement("script")
    script.src = chrome.runtime.getURL(scriptSrc)
    const css = document.createElement("link")
    css.href = chrome.runtime.getURL(cssHref)
    document.head.appendChild(script)
    document.head.appendChild(css)
}
injectResources("content/index.js","assets/bundle.css")
TanaMain.init(Extensions).then(() => console.log("Tana Extensions loaded."))