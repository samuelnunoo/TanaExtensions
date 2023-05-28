import TanaMain from "tana-extensions-core/src";
import tanaExtensions from "../content/extensions"
TanaMain.init(tanaExtensions).then(() => console.log("Tana Extensions loaded."))