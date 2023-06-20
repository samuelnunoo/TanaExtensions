import { NodeEventMessage } from "tana-extensions-core/src/ReactiveModules/TanaDomNodeEventPublisher/types/NodeEvent";
import DefaultNodeConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/configs/DefaultNodeConfig";
import ExpandedNodeConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/configs/ExpandedNodeConfig";
import FullscreenNodeConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/configs/FullscreenNodeConfig";
import _ from "lodash";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ClipboardData } from "@excalidraw/excalidraw/types/clipboard";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import React, { useEffect } from "react";
import { createRoot,  } from "react-dom/client";
import TanaDomNodeProvider from "tana-extensions-core/src/StaticModules/TanaDomNodeProvider";
import ExcalidrawExtension from ".";
import { AppState, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import ExcalidrawStateHandler from "./ExcalidrawStateHandler";
import { TanaNode } from "tana-extensions-core/src/StaticModules/TanaStateProvider/types/types";
import NodeViewConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewPublisher/types/configs/NodeViewConfig";
import TanaNodePortalState from "tana-extensions-core/src/StaticModules/TanaNodePortalRenderer/TanaNodePortalState";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import { DropEventContent } from "tana-extensions-core/src/ReactiveModules/TanaDragEventPublisher/types/OnDropEvent";

const EXCALIDRAW_DIMENSION_CLASS_NAME = "excalidraw-dimension"

export default class ExcalidrawNodeViewConfig extends NodeViewConfig<ExcalidrawExtension> {

    OnDropEvent(dropEvent: RuntimeEventInstance<DropEventContent>,nodePortalState:TanaNodePortalState,addedContentNode:HTMLElement): void {
        console.log(dropEvent,nodePortalState,addedContentNode)
    }

    setDimensions(nodeView:HTMLElement,width: string, height: string): void {
        const excalidrawDimension = nodeView.querySelector(`.${EXCALIDRAW_DIMENSION_CLASS_NAME}`) as HTMLElement
        excalidrawDimension.style.width = width
        excalidrawDimension.style.height = height 
    }
    
    createNodeView({tanaNode}: NodeEventMessage,nodePortalState:TanaNodePortalState): Promise<HTMLDivElement> {
        console.log(nodePortalState)
        return new Promise(async (resolve) => {
            const stateHandler = this.getMediator().getExcalidrawStateHandler()
            const initialData = await stateHandler.getData(tanaNode)
            const container = document.createElement("div")
            const reactInstance = React.createElement(this.getReactInstance(container,initialData,tanaNode,stateHandler,resolve))
            const root = createRoot(container)
            root.render(reactInstance)
            stateHandler.excalidrawInstances.set(tanaNode.id,root)
            return container
        })
    }

    async destroyNodeView({nodeId}: NodeEventMessage): Promise<void> {
        const stateHandler = this.getMediator().getExcalidrawStateHandler()
        stateHandler.excalidrawInstances.get(nodeId)?.unmount()
        stateHandler.excalidrawInstances.delete(nodeId)
    }

    defaultConfig(): DefaultNodeConfig {
        return {
                insertBeforeTemplateContent: true,
                lockByDefault:true,
                expandByDefault:true,
                onLock(nodeView:HTMLElement) {
                    console.log("locking")
                },
                onUnlock(nodeView) {
                    console.log("unlocking")
                },
                height:"250px",
                width: "500px",
                addSettingsButton:true,
                addBorder:false,
                allowFullscreen:true,
                hideHeaderByDefault:false 
        }
    }

    expandedConfig(): ExpandedNodeConfig {
        return {
                addBorder: false,
                hideHeader: true,
                height: "90vh",
                width:"90vw",
                lockByDefault: false,
                addSettingsButton:true,
                allowFullscreen:true 
        }
       
    }

    fullScreenConfig(): FullscreenNodeConfig {
        return {}
    }

    private getReactInstance(container:HTMLElement,initialData:ExcalidrawInitialDataState,tanaNode:TanaNode,stateHandler:ExcalidrawStateHandler,resolve:any) {
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

        return () => {
            let hasFocus = false
            //@ts-ignore
            window.excalidraw = {}

            useEffect(() => {
                resolve(container)
              }, []);  
              
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "div",
                    {
                        className: "excalidraw-dimension",
                        onWheelCapture: (e) =>  {
                            if (!hasFocus) e.stopPropagation();
                        },
                        onClick: (_) => hasFocus = true,
                        onBlur: ({relatedTarget}) => {
                            if (!relatedTarget || TanaDomNodeProvider.getViewPanelContainerFromDescendant(relatedTarget)) {
                                hasFocus = false
                            }
                        }
                    },
                    React.createElement(Excalidraw,{
                        autoFocus: false,
                        initialData,
                        onChange:  (
                            elements: readonly ExcalidrawElement[],
                            AppState: AppState
                        ) => {
                            //@ts-ignore
                            window.excalidraw.elements = elements 
                            //@ts-ignore 
                            window.excalidraw.appState = AppState
                            if (hasChanged(elements)) {
                                prevElements = elements
                                stateHandler.saveData(tanaNode.id,elements)
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

    }
    

}