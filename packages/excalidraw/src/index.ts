import {ITanaExtension} from "tana-extensions-core/src/TanaExtensionInitializer/types";
import {ITanaReplacementElement} from "tana-extensions-core/src/TanaNodeReplacementHandler/types";
import {TanaNode} from "tana-extensions-core/src/TanaStateProvider/types";
import {NodeEvent, NodeEventTypeEnum} from "tana-extensions-core/src/TanaDOMNodeListener/types";
import {Excalidraw} from "@excalidraw/excalidraw";
import TanaNodeReplacementHandler from "tana-extensions-core/src/TanaNodeReplacementHandler";
import TanaNodeAttributeEnforcer from "../../core/src/TanaNodeAttributeInspector";
import {EXCALIDRAW_CLASS_CSS_SELECTOR, EXCALIDRAW_CLASS_NAME, EXCALIDRAW_TEMPLATE_NAME} from "./types";
import {createRoot} from 'react-dom/client';
import React from "react";
import TanaDOMNodeDecorator from "tana-extensions-core/src/TanaDOMNodeDecorator";


export default new class ExcalidrawExtension implements ITanaExtension, ITanaReplacementElement {

    register(): void {
        TanaNodeReplacementHandler.registerTanaReplacementElement(this)
    }

    async createInstance(node: TanaNode): Promise<HTMLElement> {
        const App = () => {
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "div",
                    {
                        style: { height: "500px" },
                    },
                    React.createElement(Excalidraw)
                ))
        };
        const container = document.createElement("div")
        container.classList.add("excalidraw-container")
        const root = createRoot(container)
        root.render(React.createElement(App))
        return TanaDOMNodeDecorator.wrapNodeWithViewContainer(container)
    }

    async replaceElement(nodeEvent: NodeEvent) {
        const excalidrawElement = await this.createInstance(nodeEvent.tanaNode)
        TanaDOMNodeDecorator.insertToExpandedNodeContent(nodeEvent.nodeElement,excalidrawElement)
    }

    shouldReplace(nodeEvent: NodeEvent): boolean {
        if (nodeEvent.nodeEventType == NodeEventTypeEnum.Deletion) return false
        const hasExcalidrawClass = !!nodeEvent.nodeElement.querySelector(EXCALIDRAW_CLASS_CSS_SELECTOR)
        console.log(nodeEvent,hasExcalidrawClass)
       return TanaNodeAttributeEnforcer.hasTemplateWithName(nodeEvent.tanaNode,EXCALIDRAW_TEMPLATE_NAME)
        && !hasExcalidrawClass
    }

    uniqueIdentifier(): string {
        return "TanaExcalidrawExtension";
    }

}