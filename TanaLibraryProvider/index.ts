import { tanaMainSource} from "./types";

export default new class TanaLibraryProvider {
    private tanaMainSource:tanaMainSource|null = null
    public async getMainTanaSource(): Promise<tanaMainSource|null> {
        if (!!this.tanaMainSource) return this.tanaMainSource
        const source = this.getScriptsFromPage()
            .find( resource => resource.match("https://app.tana.inc/static/index.*\\.js$"))
        if (!source) return null
        const tanaSource = await import(source) as tanaMainSource
        this.tanaMainSource = tanaSource
        return tanaSource
    }
    private getScriptsFromPage() {
        console.log(this.getScriptAndLinkElementsFromPage()
            .filter(resource => resource.match(".*\\.js$")))
        return this.getScriptAndLinkElementsFromPage()
            .filter(resource => resource.match(".*\\.js$"))
    }
    private getScriptAndLinkElementsFromPage() {
        const linkHrefs = Array.from(document.querySelectorAll("link"))
            .map(l => l.href)
        const scriptSources = Array.from(document.querySelectorAll("script"))
            .map(s => s.src)
        return [...linkHrefs,...scriptSources]
    }

}