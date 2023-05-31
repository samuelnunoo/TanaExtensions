import {ITanaReplacementElement} from "./types";
import {INodeDOMListener, NodeEvent} from "../../StatefulModules/Observers/TanaDomNodeEventObserver/types";


/*
Module Responsibility:
    This module is responsible for invoking replacement events
    when
 */
export default new class TanaNodeReplacementHandler implements INodeDOMListener {
    private tanaReplacementElements: Map<string,ITanaReplacementElement>= new Map()
    public registerTanaReplacementElement(element: ITanaReplacementElement) {
        this.tanaReplacementElements.set(element.uniqueIdentifier(),element)
    }
    public unregisterTanaReplacementElement(element: ITanaReplacementElement) {
        this.tanaReplacementElements.delete(element.uniqueIdentifier())
    }
    public onNodeEvent(nodeEvent: NodeEvent): void {
        this.tanaReplacementElements.forEach(entry => {
            if (entry.shouldReplace(nodeEvent)) {
                entry.replaceElement(nodeEvent)
            }
        })
    }
}
