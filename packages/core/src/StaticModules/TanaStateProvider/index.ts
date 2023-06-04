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
    public getNodeWithId(id:string) {
        return this.getAppState()
            .chain(appState => Maybe.fromNullable(appState.nodeSpace.nodeMap.get(id)))
    }
}