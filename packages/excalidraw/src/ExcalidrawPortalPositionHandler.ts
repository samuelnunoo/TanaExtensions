import { sceneCoordsToViewportCoords } from "@excalidraw/excalidraw"
import { ExcalidrawRectangleElement } from "@excalidraw/excalidraw/types/element/types"
import { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"

export default class ExcalidrawPortalPositionHandler {

    public static positionPortal(portalElement:HTMLElement,excalidrawRect:ExcalidrawRectangleElement,appState:AppState) {
        const {x,y} = this.getXYPosition(excalidrawRect,appState)

        portalElement.style.left = `${x}px` 
        portalElement.style.top = `${y}px`
        portalElement.style.height = this.getHeight(excalidrawRect,appState)
        portalElement.style.width = this.getWidth(excalidrawRect,appState)
        this.clipOutOfBoundElementSegments(portalElement,appState)
        portalElement.style.visibility = "visible"
        portalElement.style.position = "fixed"
        portalElement.style.zIndex = "4"
    }

    public static insertPortalContainer(excalidrawApi:ExcalidrawImperativeAPI) {
        return (clientX:number,clientY:number,nodePath:string) => {
            const {x,y} = viewportCoordsToSceneCoords({clientX,clientY},excalidrawApi.getAppState())
            excalidrawApi.updateScene({
                elements:[
                    {
                        type: "rectangle",
                        version: 141,
                        versionNonce: 361174001,
                        isDeleted: false,
                        id: nodePath,
                        fillStyle: "hachure",
                        strokeWidth: 1,
                        strokeStyle: "solid",
                        roughness: 1,
                        opacity: 100,
                        angle: 0,
                        x,
                        y,
                        strokeColor: "#c92a2a",
                        backgroundColor: "transparent",
                        width: 300,
                        height: 400,
                        seed: 1968410350,
                        groupIds: [],
                        boundElements: null,
                        locked: false,
                        link: null,
                        updated: 1,
                        roundness: {
                          type: 3,
                          value: 32,
                        },
                      },
                ]
            }) 
        }

    }

    public static placePortal(excalidrawApi:ExcalidrawImperativeAPI) {
        return (nodePath:string,portal:HTMLElement) => {
            const element = excalidrawApi.getSceneElements().find(element => element.id == nodePath);
            this.positionPortal(portal, element as ExcalidrawRectangleElement, excalidrawApi.getAppState());
        }
    }
    
    private static getXYPosition(element:ExcalidrawRectangleElement,appState:AppState) {
        const {x,y} = element
        return sceneCoordsToViewportCoords({sceneX:x,sceneY:y},appState)
    }

    private static getWidth(element:ExcalidrawRectangleElement,appState:AppState) {
        return `${element.width * appState.zoom.value}px`
    }

    private static getHeight(element:ExcalidrawRectangleElement,appState:AppState) {
        return `${element.height * appState.zoom.value}px`
    }

    private static clipOutOfBoundElementSegments(portalElement:HTMLElement,appState:AppState){
        const {top,left,width,height} = portalElement.style

        const excalidrawRight = appState.offsetLeft + appState.width
        const elementRight = parseFloat(left) + parseFloat(width)

        const excalidrawBottom = appState.offsetTop + appState.height 
        const elementBottom = parseFloat(top) + parseFloat(height)
        
        const topClip = appState.offsetTop - parseFloat(top)
        const rightClip = elementRight - excalidrawRight
        const bottomClip = elementBottom - excalidrawBottom
        const leftClip = appState.offsetLeft - parseFloat(left) 
        portalElement.style.clipPath = `inset(${topClip}px ${rightClip}px ${bottomClip}px  ${leftClip}px)`

    }
    
}
function viewportCoordsToSceneCoords(arg0: { clientX: number; clientY: number }, appState: AppState): { x: any; y: any } {
    throw new Error("Function not implemented.")
}

