
import {Excalidraw} from "@excalidraw/excalidraw";
import {createRoot} from 'react-dom/client';
import React from "react";
import TanaDOMNodeDecorator from "../../core/src/StaticModules/TanaDomNodeDecorator";
import TanaExtension from "tana-extensions-core/src/types/TanaExtension";
import { InitEvent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import { TanaPubSubComponent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import { TanaNode } from "tana-extensions-core/src/StaticModules/TanaStateProvider/types/types";
import NodeEventSubscriber from "./NodeEventSubscriber";
import OnExcalidrawExtensionInitEvent from "./OnExcalidrawExtensionInitEvent";

export default class ExcalidrawExtension extends TanaExtension {

    NodeEventSubscriber = new NodeEventSubscriber(this,this.eventBus)

    getUniqueIdentifier(): string {
        return "TanaExcalidrawExtension"
    }
    getPubSubComponents(): TanaPubSubComponent[] {
        return [
            this.NodeEventSubscriber
        ]
    }
    getEventModuleInvokesOnCompletion(): InitEvent {
        return OnExcalidrawExtensionInitEvent
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



}