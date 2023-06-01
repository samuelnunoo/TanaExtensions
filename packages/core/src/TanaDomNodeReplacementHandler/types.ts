import {NodeEvent} from "../TanaDomNodeEventObserver/types";
import {TanaNode} from "../TanaStateProvider/types/types";

export interface  ITanaReplacementElement {
    uniqueIdentifier(): string
    createInstance(node:TanaNode): Promise<HTMLElement>
    shouldReplace(nodeEvent:NodeEvent): boolean
    replaceElement(nodeEvent:NodeEvent): void
}

