import {ITanaExtension} from "tana-extensions-core/src/TanaExtensionInitializer/types";
import {ITanaReplacementElement} from "tana-extensions-core/src/TanaDomNodeReplacementHandler/types";
import {TanaNode} from "packages/core/src/TanaStateProvider/types/types";
import {NodeEvent, NodeEventTypeEnum} from "tana-extensions-core/src/TanaDOMNodeListener/types";
import {Excalidraw} from "@excalidraw/excalidraw";
import TanaNodeReplacementHandler from "../../core/src/TanaDomModules/TanaDomNodeReplacementHandler";
import TanaNodeAttributeEnforcer from "../../core/src/TanaDomModules/TanaNodeAttributeInspector";
import {EXCALIDRAW_CLASS_CSS_SELECTOR, EXCALIDRAW_CLASS_NAME, EXCALIDRAW_TEMPLATE_NAME} from "./types";
import {createRoot} from 'react-dom/client';
import React from "react";
import TanaDOMNodeDecorator from "../../core/src/TanaDomModules/TanaDOMNodeDecorator";

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
        TanaDOMNodeDecorator.insertAsView(nodeEvent.nodeElement,nodeEvent.panel,excalidrawElement)
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