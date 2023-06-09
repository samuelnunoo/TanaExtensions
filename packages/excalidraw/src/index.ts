import {Excalidraw} from "@excalidraw/excalidraw";
import React, {ReactNode} from "react";
import TanaDOMNodeDecorator from "../../core/src/StaticModules/TanaDomNodeDecorator";
import TanaExtension from "tana-extensions-core/src/types/TanaExtension";
import { InitEvent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import { TanaPubSubComponent } from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaPubSubModule";
import { TanaNode } from "tana-extensions-core/src/StaticModules/TanaStateProvider/types/types";
import NodeEventSubscriber from "./NodeEventSubscriber";
import OnExcalidrawExtensionInitEvent from "../types/OnExcalidrawExtensionInitEvent";
import {AppState, BinaryFiles, ExcalidrawInitialDataState} from "@excalidraw/excalidraw/types/types";
import {ExcalidrawElement} from "@excalidraw/excalidraw/types/element/types";
import {ClipboardData} from "@excalidraw/excalidraw/types/clipboard";
import UpdateNodeDataEvent, { UpdateNodeDataEventMessage } from "database-extension/types/UpdateNodeDataEvent";
import GetNodeDataEvent from "database-extension/types/GetNodeDataEvent";
import {array, Codec, unknown} from "purify-ts";
import _ from "lodash";
import _default from "@excalidraw/excalidraw/types/packages/excalidraw/example/initialData";
import {createRoot, Root} from "react-dom/client";
import {VIEW_CONTAINER_CSS_SELECTOR} from "tana-extensions-core/src/StaticModules/TanaDomNodeDecorator/types";

export default class ExcalidrawExtension extends TanaExtension {

    NodeEventSubscriber = new NodeEventSubscriber(this,this.eventBus)

    excalidrawInstances: Map<string,Root> = new Map()
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

    saveData(
        nodeId:string,
        elements: readonly ExcalidrawElement[],
        appState: AppState,
        files: BinaryFiles,
    ) {
        const data:ExcalidrawInitialDataState = {
            elements
        }
        const message:UpdateNodeDataEventMessage = {
            nodeId,
            isDelete: false,
            content: data 
        }
        const event = UpdateNodeDataEvent.createInstance(message)
        this.eventBus.dispatchRuntimeEvent(event)
    }

    async getData(node:TanaNode) {
        const message = GetNodeDataEvent.createInstance({nodeId:node.id})
        const data = await this.eventBus.dispatchEventAndAWaitFirstReply(message,3)
        const state = Codec.interface({
            elements:array(unknown)
        })
        const codec = Codec.interface({
            message: Codec.interface({content:Codec.interface({content:state})})
        })

        const results = codec.decode(data)
            .map(data => data.message.content.content as ExcalidrawInitialDataState)
            .orDefault({})

        return results
    }

    async createInstance(node: TanaNode): Promise<HTMLElement> {
        const saveData = this.saveData.bind(this)
        const initialData = await this.getData(node)
        let prevElements = 'elements' in initialData ? initialData.elements : []
        const hasChanged = (elements: readonly any[]) => {
            if (elements.length !== prevElements!.length) return true
            for (let i = 0; i < elements.length; i++) {
                const curr = elements[i]
                const prev = prevElements![i]
                if (!_.isEqual(curr,prev)) return true
            }
            return false
        }


        const panelContent = document.querySelector(".panelContent") as HTMLElement
        const App = () => {
            let hasFocus = false
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "div",
                    {
                        style: { height: "500px" },

                        onWheelCapture: (e) =>  {
                            if (!hasFocus) e.stopPropagation();
                        },
                        onClick: (e) => hasFocus = true,
                        onBlur: ({relatedTarget}) => {
                            if (!relatedTarget || !(relatedTarget as HTMLElement).closest(VIEW_CONTAINER_CSS_SELECTOR)) {
                                hasFocus = false
                            }
                        }
                    },
                    React.createElement(Excalidraw,{
                        autoFocus: false,
                        initialData,
                        onChange:  (
                            elements: readonly ExcalidrawElement[],
                            appState: AppState,
                            files: BinaryFiles,
                        ) => {
                            if (hasChanged(elements)) {
                                prevElements = elements
                                saveData(node.id,elements,appState,files)
                            }

                        },
                        onPaste: (
                            data: ClipboardData,
                            event: ClipboardEvent | null,
                        ) => {
                            console.log("paste",data,event)
                            return true
                        }
                    },  )
                ))
        };
        const container = document.createElement("div")
        container.classList.add("excalidraw-container")
        const root = createRoot(container)
        this.excalidrawInstances.set(node.id,root)
        root.render(React.createElement(App))
        return TanaDOMNodeDecorator.wrapNodeWithViewContainer(container)
    }
}