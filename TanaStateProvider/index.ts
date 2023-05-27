import {AppState,TanaWindow} from "./types";


export default new class TanaStateProvider {

    public  getAppState():AppState {
        return ((window as unknown) as TanaWindow).appState
    }

    public  getNodeWithId(id:string) {
        return this.getAppState().nodeSpace.nodeMap.get(id)
    }



}