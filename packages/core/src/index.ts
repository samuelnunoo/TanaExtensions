import TanaExtensionInitializer from "./TanaExtensionInitializer";
import TanaListenerInitializer from "./TanaListenerInitializer";
import TanaLoader from "./TanaLoader";
import {ITanaExtension} from "./TanaExtensionInitializer/types";
import TanaDomPanelListener from "./TanaDomPanelListener";

export default class TanaMain {

    public static async init(tanaExtensions:ITanaExtension[]) {
        console.log("Waiting for App State")
        await TanaLoader.waitForFieldToInstantiate(window,"appState")
        console.log("appState Loaded")
        console.log("Initializing Listeners...")
        await TanaListenerInitializer.init()
        console.log("Initializing Extensions...")
        await TanaExtensionInitializer.initialize(tanaExtensions)
        console.log("Invoking Initial Panel Event...")
        TanaDomPanelListener.invokeInitialPanelEvents()
    }

}
