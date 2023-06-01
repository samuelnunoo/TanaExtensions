import {TanaWindow} from "./types/types";
import {Maybe} from "purify-ts";
import {ITanaStateProvider} from "./types/ITanaStateProvider";

export default new class TanaStateProvider implements ITanaStateProvider {
    public getAppState() {
        return Maybe.fromNullable(((window as unknown) as TanaWindow).appState)
    }
    public getPrimarySettingsNode() {
        const {homeNode} = this.getAppState().map(appState => appState.nodeSpace)
        const {parentFile} = homeNode
        return Maybe.fromNullable(homeNode.nodeSpace.userSettings.getOrCreateSettingsNodeFor(parentFile))
    }
    public getNodeWithId(id:string) {
        return this.getAppState().map(appState => appState.nodeSpace.nodeMap.get(id))
    }
}