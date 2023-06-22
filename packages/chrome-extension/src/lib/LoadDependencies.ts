const REACT_SIGNATURE = "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED"
const TANA_STATIC_PATH_PREFIX = "https://app.tana.inc/static/"
class LibInitializer {
 
    public static async setupReactLibrary():Promise<any|null> {
        const vendorModule = await this.getVendorModule()
        const reactModule = this.getExportByFirstPredicateMatch(vendorModule,(exportItem) => {
            return typeof exportItem == "object" && this.exportHasAllProperties(exportItem,[
                REACT_SIGNATURE,"useRef","useState","useEffect"
            ])
        })

        //@ts-ignore
        window.React = reactModule
    }

    public static async setupReactDomLibrary():Promise<any|null> {
        const vendorModule = await this.getVendorModule()
        const reactDomModule = this.getExportByFirstPredicateMatch(vendorModule,(exportItem) => {
            return typeof exportItem == "object"  && this.exportHasAllProperties(exportItem,[
                REACT_SIGNATURE,"findDOMNode","render","flushSync","createPortal"
            ])
        })

        //@ts-ignore 
        window.ReactDOM = reactDomModule
    }

    private static exportHasAllProperties(exportItem:object,properties:string[]) {
        for (const property of properties) {
            if (!(property in exportItem)) return false 
        }
        return true 
    }

    private static getExportByFirstPredicateMatch(module:Object,predicate:(value:any) => boolean) {
        for (const exportItem of Object.keys(module)) {
            if (predicate(module[exportItem])) return module[exportItem]
        }
        return null 
    }

    private static async getVendorModule() {
        //@ts-ignore 
        if (window.vendorModule) return window.vendorModule 
        for (const script of this.getScriptsFromPage()) {
            if (!!script.match(TANA_STATIC_PATH_PREFIX + "vendor.*\\.js")) {
                const vendorModule = await import(script)
                //@ts-ignore 
                window.vendorModule = vendorModule
                return vendorModule
        }
    }
        return null 
    }

    private static getScriptsFromPage() {
        console.log(this.getScriptAndLinkElementsFromPage()
            .filter(resource => resource.match(".*\\.js$")))
        return this.getScriptAndLinkElementsFromPage()
            .filter(resource => resource.match(".*\\.js$"))
    }

    private static getScriptAndLinkElementsFromPage() {
        const linkHrefs = Array.from(document.querySelectorAll("link"))
            .map(l => l.href)
        const scriptSources = Array.from(document.querySelectorAll("script"))
            .map(s => s.src)
        return [...linkHrefs,...scriptSources]
    }
}

(async function() {
    console.log("I AM LOADING HERE")
    await LibInitializer.setupReactLibrary()
    await LibInitializer.setupReactDomLibrary()
    console.log("I FINISHED LOADING HERE")
})()