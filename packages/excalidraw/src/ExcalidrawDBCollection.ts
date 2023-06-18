import DBCollection from "database-extension/types/database/DBCollection";
import {ExcalidrawElement} from "@excalidraw/excalidraw/types/element/types";

export interface ExcalidrawContent {
    elements: readonly ExcalidrawElement[]
}

export default new DBCollection<ExcalidrawContent>("excalidraw-collection")