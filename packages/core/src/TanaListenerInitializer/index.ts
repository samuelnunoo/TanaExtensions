import TanaNodeTransactionListener from "../TanaNodeTransactionListener";
import TanaNodeReplacementHandler from "../TanaNodeReplacementHandler";
import TanaLoader from "../TanaLoader";
import TanaDomPanelListener from "../TanaDomPanelListener";
import TanaDOMNodeListener from "../TanaDOMNodeListener";
import tanaDOMNodeListener from "../TanaDOMNodeListener";

export default class TanaListenerInitializer {
    public static async init() {
        await TanaLoader.waitForPageDOMToCompleteInitialization()
        await TanaDomPanelListener.init()
        tanaDOMNodeListener.initialize()
        TanaDomPanelListener.registerListener(TanaDOMNodeListener)
        TanaDOMNodeListener.registerListener(TanaNodeReplacementHandler)
        TanaDomPanelListener.invokeInitialPanelEvents()
        await TanaNodeTransactionListener.init()
    }
}