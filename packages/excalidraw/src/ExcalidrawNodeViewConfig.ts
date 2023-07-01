import { NodeEventMessage } from "tana-extensions-core/src/ReactiveModules/TanaNodeEventModule/types/NodeEvent";
import DefaultNodeConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/configs/DefaultNodeConfig";
import ExpandedNodeConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/configs/ExpandedNodeConfig";
import FullscreenNodeConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/configs/FullscreenNodeConfig";
import _ from "lodash";
import reactDOM from "react-dom"
import ExcalidrawExtension from ".";
import TanaExcalidraw from "./components/TanaExcalidraw";
import React from "react";
import NodeViewConfig from "tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/configs/NodeViewConfig";
import TanaNodePortalState from "tana-extensions-core/src/StaticModules/NodePortalModules/TanaNodePortalRenderer/TanaNodePortalState";
import NodeViewEvents from "tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/configs/NodeViewEvents";

const EXCALIDRAW_DIMENSION_CLASS_NAME = "excalidraw-dimension"

export default class ExcalidrawNodeViewConfig extends NodeViewConfig<ExcalidrawExtension> {
    templateName(): string {
        return "excalidraw-extension"
    }


    setDimensions(nodeView:HTMLElement,width: string, height: string): void {
        const excalidrawDimension = nodeView.querySelector(`.${EXCALIDRAW_DIMENSION_CLASS_NAME}`) as HTMLElement
        excalidrawDimension.style.width = width
        excalidrawDimension.style.height = height 
    }
    
    createNodeView({tanaNode}: NodeEventMessage,nodePortalState:TanaNodePortalState,nodeViewEvents:NodeViewEvents): Promise<HTMLDivElement> {
        return new Promise(async (resolve) => {
            const stateHandler = this.getMediator().getExcalidrawStateHandler()
            const initialData = await stateHandler.getData(tanaNode)
            const container = document.createElement("div") as HTMLDivElement
    
            reactDOM.render(React.createElement(TanaExcalidraw,{
                initialData,
                nodePortalState,
                stateHandler,
                nodeViewEvents,
                tanaNode,
                resolve,
                container 
            },null),container)
            
            stateHandler.excalidrawInstances.set(tanaNode.id,container)
            return container
        })
    }

    async destroyNodeView({nodeId}: NodeEventMessage): Promise<void> {
        const stateHandler = this.getMediator().getExcalidrawStateHandler()
        const container = stateHandler.excalidrawInstances.get(nodeId)
        reactDOM.unmountComponentAtNode(container as Element)
        stateHandler.excalidrawInstances.delete(nodeId)
    }

    defaultConfig(): DefaultNodeConfig {
        return {
                insertBeforeTemplateContent: true,
                lockByDefault:true,
                expandNodePortalsByDefault:false,
                expandByDefault:true,
                onLock(nodeView:HTMLElement) {
                    console.log("locking")
                },
                onUnlock(nodeView) {
                    console.log("unlocking")
                },
                height:"400px",
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
                expandNodePortalsByDefault: false,
                height: "90vh",
                width:"100%",
                lockByDefault: false,
                addSettingsButton:true,
                allowFullscreen:true 
        }
       
    }

    fullScreenConfig(): FullscreenNodeConfig {
        return {}
    }

}