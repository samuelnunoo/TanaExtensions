import {TanaWindow} from "./types/types";
import {Just, Maybe} from "purify-ts";

export default new class TanaStateProvider  {
    public getAppState() {
        return Maybe.fromNullable((window as unknown) as TanaWindow)
            .map(window => window.appState)
    }
    public getPrimarySettingsNode() {
        return this.getAppState()
            .chain(appState => Just(appState.nodeSpace.homeNode))
            .chain(homeNode => Just(homeNode.nodeSpace.userSettings.getOrCreateSettingsNodeFor(homeNode.parentFile)))
    }

    public getRandomColorId() {
        const colors = ["#d1086d", "#a60717", "#ff9100", "#d48c0d", "#d6ba04", "#9db325", "#1dbf8c", "#0558ab", "#0066ff", "#4303a8", "#8b299e", "#f750d3"]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    public getNodeWithId(id:string) {
        return this.getAppState()
            .chain(appState => Maybe.fromNullable(appState.nodeSpace.nodeMap.get(id)))
    }
}