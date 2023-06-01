import {Maybe} from "purify-ts/esm";
import {AppState, TanaNode} from "./types";

export interface ITanaStateProvider {
    getAppState(): Maybe<AppState>
    getPrimarySettingsNode():Maybe<TanaNode>
    getNodeWithId(id:string): Maybe<TanaNode>
}