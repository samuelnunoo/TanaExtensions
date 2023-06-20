import NodeViewConfig from "./types/configs/NodeViewConfig";

export default class NodeViewStateHandler {

    private nodeViewRegistry: Map<string,NodeViewConfig<any>> = new Map()

    addEntry<T>(templateId:string,config:NodeViewConfig<T>) {
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