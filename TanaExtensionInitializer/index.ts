import TanaExtensionRegistry from "../TanaExtensionRegistry";

//https://stackoverflow.com/questions/52483853/how-to-compile-typescript-for-the-browser
export default class TanaExtensionInitializer {
    public static async initialize() {
        console.log("Loading Tana Extensions ...")
        console.time("Loading Complete")
        const extensions = TanaExtensionRegistry.getExtensions()
        for (const extension of extensions) {
            await extension.register()
        }
        console.timeEnd("Loading Complete")
    }
}
