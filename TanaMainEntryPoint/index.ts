import TanaExtensionInitializer from "../TanaExtensionInitializer";
import TanaListenerInitializer from "../TanaListenerInitializer";
import TanaLoader from "../TanaLoader";

class TanaMainEntryPoint {
    public static async main() {
        console.log("Loading...")
        console.log("Waiting for App State")
        await TanaLoader.waitForFieldToInstantiate(window,"appState")
        await TanaMainEntryPoint.initComponents()
    }
    private static async initComponents() {
        console.log("appState Loaded")
        console.log("Initializing Listeners...")
        await TanaListenerInitializer.init()
        console.log("Initializing Extensions...")
        await TanaExtensionInitializer.initialize()
    }

}
TanaMainEntryPoint.main().then(() => console.log("Loading Complete!"))
