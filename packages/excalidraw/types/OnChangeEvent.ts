import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { AppState } from "@excalidraw/excalidraw/types/types"

export const ON_CHANGE_EVENT = "onChangeEvent"

export interface ExcalidrawChangeEventContent {
    elements: readonly ExcalidrawElement[]
    appState: AppState
}