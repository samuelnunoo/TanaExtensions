import TanaNodeTransactionListener from "../TanaNodeTransactionObserver";
import TanaNodeReplacementHandler from "../TanaDomNodeReplacementHandler";
import TanaLoader from "../TanaLoader";
import TanaDomPanelListener from "../TanaDomPanelEventObserver";
import TanaDOMNodeListener from "../TanaDomNodeEventObserver";
import tanaDOMNodeListener from "../TanaDomNodeEventObserver";

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