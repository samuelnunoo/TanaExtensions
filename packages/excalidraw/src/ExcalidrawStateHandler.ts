import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types"
import GetNodeDataEvent from "database-extension/types/events/GetNodeDataEvent"
import UpdateNodeDataEvent, { UpdateNodeDataEventMessage } from "database-extension/types/events/UpdateNodeDataEvent"
import { Codec, array, unknown } from "purify-ts"
import { TanaNode } from "tana-extensions-core/src/StaticModules/TanaStateProvider/types/types"
import ExcalidrawDBCollection, { ExcalidrawContent } from "./ExcalidrawDBCollection"
import EventBus from "tana-extensions-core/src/ReactiveModules/EventBus"


export default class ExcalidrawStateHandler {
    eventBus:EventBus
    excalidrawInstances: Map<string,HTMLDivElement> = new Map()

    constructor(eventBus:EventBus) {
        this.eventBus = eventBus
    }
    
    saveData(
        nodeId:string,
        elements: readonly ExcalidrawElement[]
    ) {
        const data:ExcalidrawContent = {
            elements
        }

        const message:UpdateNodeDataEventMessage<ExcalidrawContent> = {
            nodeId,
            dbCollection:ExcalidrawDBCollection,
            content: data 
        }
        const event = UpdateNodeDataEvent.createInstance(message)
        this.eventBus.dispatchRuntimeEvent(event)
    }

    async getData(node:TanaNode) {
        const message = GetNodeDataEvent.createInstance({nodeId:node.id, collection:ExcalidrawDBCollection})
        const data = await this.eventBus.dispatchEventAndAWaitFirstReply(message,3)
        const state = Codec.interface({
            elements:array(unknown)
        })
        const codec = Codec.interface({
            message: Codec.interface({dbEntry:Codec.interface({content:state})})
        })

        const results = codec.decode(data)
            .map(data => data.message.dbEntry.content as ExcalidrawInitialDataState)
            .orDefault({})

        return results
    }


}