import { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types/types";
import { DropEventContent, ON_DROP_DOM_EVENT } from '../../../core/src/ReactiveModules/TanaDragEventPublisher/types/OnDropEvent';
import {useEffect} from "react" 

export default function useDropEffect(excalidrawRef:HTMLElement|null,excalidrawApi:ExcalidrawAPIRefValue|null) {
    useEffect(() => {
    if (!excalidrawRef || !excalidrawApi) return 

    const handleOnDropEvent = ((event:CustomEvent<DropEventContent>) => {
        console.log(event)
        console.log(excalidrawApi)
    }) as EventListener

     excalidrawRef.addEventListener(ON_DROP_DOM_EVENT,handleOnDropEvent)

     return () => {
        excalidrawRef.removeEventListener(ON_DROP_DOM_EVENT,handleOnDropEvent)
     }
    },[excalidrawRef,excalidrawApi])

    

}