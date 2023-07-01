import autoBind from "auto-bind"
import { Maybe } from "purify-ts"


export default class NodePortalResizeObserver {
    resizeObservers: Map<HTMLElement,ResizeObserver> = new Map() 

    constructor() {
        autoBind(this)
    }

    registerNodePortal(nodePortal:HTMLElement,onSizeChangeEvent:ResizeObserverCallback) {
        const observer = new ResizeObserver(onSizeChangeEvent)
        observer.observe(nodePortal,{
            box:"border-box"
        })
        this.resizeObservers.set(nodePortal,observer)
    }

    unregisterNodePortal(nodePortal:HTMLElement) {
        Maybe.fromNullable(this.resizeObservers.get(nodePortal))
            .chainNullable(observer => observer.disconnect())
            .chainNullable( _ => this.resizeObservers.delete(nodePortal))
    }

}