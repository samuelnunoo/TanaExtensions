import NodeViewConfig from "./types/configs/NodeViewConfig";

export default class NodeViewStateHandler {

    nodeViewRegistry: Map<string,NodeViewConfig> = new Map()

    addEntry(templateId:string,config:NodeViewConfig) {
        if (this.hasEntry(templateId)) return 
        this.nodeViewRegistry.set(templateId,config)
    }

    getEntry(templateId:string) {
        return this.nodeViewRegistry.get(templateId)
    }

    hasEntry(templateId:string) {
        return this.nodeViewRegistry.has(templateId)
    }
}