import TanaExtension from "tana-extensions-core/src/types/TanaExtension"
import ExcalidrawExtension from "extension-excalidraw/src"
import EventBus from "tana-extensions-core/src/ReactiveModules/EventBus"
import TanaDatabaseExtension from "database-extension/src";



export default function (eventBus:EventBus) {
    return [
        new ExcalidrawExtension(eventBus),
        new TanaDatabaseExtension(eventBus)
    ] as TanaExtension[]
}