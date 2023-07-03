import autoBind from "auto-bind"
import { Maybe } from "purify-ts"
import NodePortal from "../NodePortal"


export default class NodePortalResizeObserver {
    resizeObservers: Map<NodePortal,ResizeObserver> = new Map() 

    constructor() {
        autoBind(this)
    }

    registerNodePortal(nodePortal:NodePortal,onSizeChangeEvent:ResizeObserverCallback) {
        const observer = new ResizeObserver(onSizeChangeEvent)
        observer.observe(nodePortal.getPortalDomNode(),{
            box:"border-box"
        })
        this.resizeObservers.set(nodePortal,observer)
    }

    unregisterNodePortal(nodePortal:NodePortal) {
        Maybe.fromNullable(this.resizeObservers.get(nodePortal))
            .chainNullable(observer => observer.disconnect())
            .chainNullable( _ => this.resizeObservers.delete(nodePortal))
    }

}