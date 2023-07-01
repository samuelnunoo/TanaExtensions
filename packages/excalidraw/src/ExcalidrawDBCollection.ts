import DBCollection from "database-extension/types/database/DBCollection";
import {ExcalidrawElement} from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";

export interface ExcalidrawContent {
    elements: readonly ExcalidrawElement[]
    appState: Partial<AppState>
}

export default new DBCollection<ExcalidrawContent>("excalidraw-collection")