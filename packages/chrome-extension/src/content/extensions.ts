import TanaExtension from "tana-extensions-core/src/types/TanaExtension"
import CodeBlockExtension from "extension-code-block/src"
import ExcalidrawExtension from "extension-excalidraw/src"
import EventBus from "tana-extensions-core/src/ReactiveModules/EventBus"

export default function (eventBus:EventBus) {
    return [
        new CodeBlockExtension(eventBus),
        new ExcalidrawExtension(eventBus)
    ] as TanaExtension[]
}