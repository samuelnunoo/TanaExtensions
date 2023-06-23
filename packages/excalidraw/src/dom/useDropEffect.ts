import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { ON_DROP_DOM_EVENT } from 'tana-extensions-core/src/ReactiveModules/TanaDragDropModule/types/OnDropEvent';
import { useEffect } from "react" 
import ExpandedDropEventContent from 'tana-extensions-core/src/ReactiveModules/TanaNodeViewModule/types/events/ExpandedDropEventContent';
import ExcalidrawPortalPositionHandler from "../ExcalidrawPortalPositionHandler";
import TanaNodePortalState from "tana-extensions-core/src/StaticModules/TanaNodePortalRenderer/TanaNodePortalState";
import { ExcalidrawChangeEventContent } from "../../types/OnChangeEvent";

export const ON_CHANGE_EVENT = "onChangeEvent"

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

     const handleOnChangeEvent = (((event:CustomEvent<ExcalidrawChangeEventContent>) => {
        nodePortalState.runCommandOnPortals((portal:HTMLElement,nodePath:string) => {
            placementMethod(nodePath,portal)
        })
     })) as EventListener
 
    excalidrawRef.addEventListener(ON_DROP_DOM_EVENT,handleOnDropEvent)
    excalidrawRef.addEventListener(ON_CHANGE_EVENT,handleOnChangeEvent)

    return () => {
        excalidrawRef.removeEventListener(ON_DROP_DOM_EVENT,handleOnDropEvent)
        excalidrawRef.removeEventListener(ON_CHANGE_EVENT,handleOnChangeEvent)
     }
    },[excalidrawRef,excalidrawApi])

    
 


}