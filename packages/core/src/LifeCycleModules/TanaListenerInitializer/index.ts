import TanaNodeTransactionListener from "../../StatefulModules/Observers/TanaNodeTransactionObserver";
import TanaNodeReplacementHandler from "../../TanaDomModules/TanaDomNodeReplacementHandler";
import TanaLoader from "../TanaLoader";
import TanaDomPanelListener from "../../StatefulModules/Observers/TanaDomPanelEventObserver";
import TanaDOMNodeListener from "../../StatefulModules/Observers/TanaDomNodeEventObserver";
import tanaDOMNodeListener from "../../StatefulModules/Observers/TanaDomNodeEventObserver";

export default class TanaListenerInitializer {
    public static async init() {
        await TanaLoader.waitForPageDomToCompletInitialization()
        TanaDomPanelListener.init()
        tanaDOMNodeListener.initialize()
        TanaDomPanelListener.registerListener(TanaDOMNodeListener)
        TanaDOMNodeListener.registerListener(TanaNodeReplacementHandler)
        TanaNodeTransactionListener.init()
    }
}