import { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ON_DROP_DOM_EVENT } from '../../../core/src/ReactiveModules/TanaDragEventPublisher/types/OnDropEvent';
import { useEffect } from "react" 
import { viewportCoordsToSceneCoords } from "@excalidraw/excalidraw";
import ExpandedDropEventContent from '../../../core/src/ReactiveModules/TanaNodeViewPublisher/types/events/ExpandedDropEventContent';
import ExcalidrawPortalPositionHandler from "../ExcalidrawPortalPositionHandler";
import { ExcalidrawRectangleElement } from "@excalidraw/excalidraw/types/element/types";
import TanaNodePortalState from "tana-extensions-core/src/StaticModules/TanaNodePortalRenderer/TanaNodePortalState";


export default function useDropEffect(excalidrawRef:HTMLElement|null,excalidrawApi:ExcalidrawImperativeAPI|null,nodePortalState:TanaNodePortalState) {
    useEffect(() => {
    if (!excalidrawRef || !excalidrawApi) return 
    
    const placementMethod = ExcalidrawPortalPositionHandler.placePortal(excalidrawApi)
    const insertPortalContainer = ExcalidrawPortalPositionHandler.insertPortalContainer(excalidrawApi)
    nodePortalState.runCommandOnPortals((portal:HTMLElement,nodePath:string) => {
        placementMethod(nodePath,portal)
    })

    const handleOnDropEvent = ((event:CustomEvent<ExpandedDropEventContent>) => {
        const {clientX,clientY} = event.detail.mouseEvent
        const portal = event.detail.contentDomNode
        const nodePath = event.detail.nodePath
        insertPortalContainer(clientX,clientY,nodePath)
        placementMethod(nodePath,portal)

     }) as EventListener
 
    excalidrawRef.addEventListener(ON_DROP_DOM_EVENT,handleOnDropEvent)

    return () => {
        excalidrawRef.removeEventListener(ON_DROP_DOM_EVENT,handleOnDropEvent)
     }
    },[excalidrawRef,excalidrawApi])

    
 


}