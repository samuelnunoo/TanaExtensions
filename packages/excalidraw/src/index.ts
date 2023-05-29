import {ITanaExtension} from "tana-extensions-core/src/TanaExtensionInitializer/types";
import {ITanaReplacementElement} from "tana-extensions-core/src/TanaNodeReplacementHandler/types";
import {TanaNode} from "tana-extensions-core/src/TanaStateProvider/types";
import {NodeEvent} from "tana-extensions-core/src/TanaDOMNodeListener/types";
import {Excalidraw} from "@excalidraw/excalidraw";
import TanaNodeReplacementHandler from "tana-extensions-core/src/TanaNodeReplacementHandler";
import TanaNodeAttributeEnforcer from "tana-extensions-core/src/TanaNodeAttributeEnforcer";
import {EXCALIDRAW_TEMPLATE_NAME} from "./types";
import * as ReactDOM from "react-dom"
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
                    React.createElement(Excalidraw),
                ),
            );
        };
        const container = document.createElement("div")
        ReactDOM.render(React.createElement(App),container)
        return container
    }

    async replaceElement(nodeEvent: NodeEvent) {
        const excalidrawElement = await this.createInstance(nodeEvent.tanaNode)
        TanaDOMNodeDecorator.replaceContentNode(nodeEvent.nodeElement,excalidrawElement)

    }

    shouldReplace(nodeEvent: NodeEvent): boolean {
       return TanaNodeAttributeEnforcer.hasTemplateWithName(nodeEvent.tanaNode,EXCALIDRAW_TEMPLATE_NAME)
    }

    uniqueIdentifier(): string {
        return "TanaExcalidrawExtension";
    }

}