
//https://stackoverflow.com/questions/52483853/how-to-compile-typescript-for-the-browser
import {ITanaExtension} from "./types";

export default class TanaExtensionInitializer {
    public static async initialize(extensions:ITanaExtension[]) {
        console.log("Loading Tana Extensions ...")
        console.time("Loading Complete")
        for (const extension of extensions) {
            await extension.register()
        }
        console.timeEnd("Loading Complete")
    }
}
