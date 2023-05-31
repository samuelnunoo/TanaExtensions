import {NodeEvent} from "../../StatefulModules/Observers/TanaDomNodeEventObserver/types";
import {TanaNode} from "../../DataProviders/TanaStateProvider/types/types";

export interface  ITanaReplacementElement {
    uniqueIdentifier(): string
    createInstance(node:TanaNode): Promise<HTMLElement>
    shouldReplace(nodeEvent:NodeEvent): boolean
    replaceElement(nodeEvent:NodeEvent): void
}

