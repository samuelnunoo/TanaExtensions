import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useEffect } from "react" 
import ExpandedDropEventContent from 'tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/events/ExpandedDropEventContent';
import ExcalidrawPortalPositionHandler from '../handlers/ExcalidrawPortalPositionHandler';
import { ExcalidrawChangeEventContent } from "../../types/OnChangeEvent";
import TanaNodePortalState from "tana-extensions-core/src/StaticModules/NodePortalModules/TanaNodePortalRenderer/TanaNodePortalState";
import NodeViewEvents from "tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/configs/NodeViewEvents";
import NodePortalResizeContent from "tana-extensions-core/src/StaticModules/NodePortalModules/NodePortalResizeObserver/types/NodePortalResizeContent";
import ExcalidrawPortalStateHandler from "../handlers/ExcalidrawPortalStateHandler";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import _ from "lodash";
import TanaDomNodeProvider from "tana-extensions-core/src/StaticModules/TanaDomNodeProvider";
import NodePortal from "tana-extensions-core/src/StaticModules/NodePortalModules/NodePortal";
import { Maybe } from 'purify-ts';

export const ON_CHANGE_EVENT = "onChangeEvent"
export const ON_RESIZE_EVENT = "onResizeEvent"

export default function useDropEffect(
    excalidrawRef:HTMLElement|null,excalidrawApi:ExcalidrawImperativeAPI|null,
    nodePortalState:TanaNodePortalState, nodeViewEvents:NodeViewEvents, excalidrawPortalState:ExcalidrawPortalStateHandler
    ) {

    useEffect(() => {
    if (!excalidrawRef || !excalidrawApi) return 
    
    const placementMethod = ExcalidrawPortalPositionHandler.placePortal(excalidrawApi,excalidrawPortalState)
    const insertPortalContainer = ExcalidrawPortalPositionHandler.insertPortalContainer(excalidrawApi)
    const hasSceneElements = excalidrawApi.getSceneElements().length > 0
    
    if (hasSceneElements) {
        nodePortalState.runCommandOnPortals((portal:NodePortal,portalId:string) => {
            placementMethod(portalId,portal)
        })
    }
   
    const handleOnDropEvent = ((event:CustomEvent<ExpandedDropEventContent>) => {
        console.log("handle on drop")
        const {clientX,clientY} = event.detail.mouseEvent
        const {nodePortal} = event.detail
        const {width,height} = nodePortal.getPortalDomNode().getBoundingClientRect()
        excalidrawPortalState.setPortalDomRect(nodePortal.getPortalId(),{width,height})
        insertPortalContainer(clientX,clientY,nodePortal.getPortalId())
        placementMethod(nodePortal.getPortalId(),nodePortal)

     }) as EventListener

     const handleOnChangeEvent = (((event:CustomEvent<ExcalidrawChangeEventContent>) => {
        for (const element of event.detail.elements) {
            Maybe.fromNullable(nodePortalState.getNodePortal(element.id))
            .chainNullable(portal => placementMethod(portal.getPortalId(),portal))
        }
     })) as EventListener
 
     const handleResizeEvent = (((event:CustomEvent<NodePortalResizeContent>) => {
        for (const resizeData of event.detail.portalResizeData) {
            console.log("Setting Resize Stuff")
            const {width,height} = resizeData.contentRect
            excalidrawPortalState.setPortalDomRect(event.detail.nodePortal.getPortalId(),{width,height})
            const elements: readonly ExcalidrawElement[] = excalidrawApi.getSceneElements()
            ExcalidrawPortalPositionHandler.fitRectToPortal(elements,excalidrawPortalState,excalidrawApi)
        }
     })) as EventListener


     const panel = TanaDomNodeProvider.getPanelFromDescendant(excalidrawRef)!
     const panelContent = TanaDomNodeProvider.getPanelContentNodeFromDescendant(excalidrawRef)!
     const resizeObserver = new ResizeObserver((_) => excalidrawApi.refresh())
     resizeObserver.observe(panelContent)
     panel.addEventListener("scroll", (event) => {
        excalidrawApi.refresh()
     })
     nodeViewEvents.addOnDropEventListener(handleOnDropEvent)
     excalidrawRef.addEventListener(ON_CHANGE_EVENT,handleOnChangeEvent)
     nodeViewEvents.addNodePortalResizeListener(handleResizeEvent)

    return () => {
        resizeObserver.disconnect()
        nodeViewEvents.removeNodePortalResizeListener(handleOnDropEvent)
        excalidrawRef.removeEventListener(ON_CHANGE_EVENT,handleOnChangeEvent)
     }
    },[excalidrawRef,excalidrawApi])

    
 


}