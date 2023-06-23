import { sceneCoordsToViewportCoords, viewportCoordsToSceneCoords } from "@excalidraw/excalidraw"
import { ExcalidrawRectangleElement } from "@excalidraw/excalidraw/types/element/types"
import { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"

const PADDING = 0.1

export default class ExcalidrawPortalPositionHandler {

    public static positionPortal(portalElement:HTMLElement,excalidrawRect:ExcalidrawRectangleElement,appState:AppState) {
        const {x,y} = this.getXYPosition(excalidrawRect,appState)

        portalElement.style.left = `${x + this.getMargin(excalidrawRect.width,appState)}px` 
        portalElement.style.top = `${y + this.getMargin(excalidrawRect.height,appState)}px`
        portalElement.style.height = `${this.getDimension(excalidrawRect.height,appState)}px`
        portalElement.style.width = `${this.getDimension(excalidrawRect.width,appState)}px`
        this.clipOutOfBoundElementSegments(portalElement,appState)
        portalElement.style.visibility = "visible"
        portalElement.style.position = "fixed"
        portalElement.style.zIndex = "3"
        portalElement.style.scale = `${appState.zoom.value}`
        portalElement.style.transformOrigin = "top left"
    }

    public static insertPortalContainer(excalidrawApi:ExcalidrawImperativeAPI) {
        return (clientX:number,clientY:number,nodePath:string) => {
            const {x,y} = viewportCoordsToSceneCoords({clientX,clientY},excalidrawApi.getAppState())
            const element = {
                type: "rectangle",
                version: 141,
                versionNonce: 361174001,
                isDeleted: false,
                id: nodePath,
                fillStyle: "solid",
                strokeWidth: 1,
                strokeStyle: "solid",
                roughness: 1,
                opacity: 100,
                angle: 0,
                x,
                y,
                strokeColor: "#495057",
                backgroundColor: "#ced4da",
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
              } as ExcalidrawRectangleElement

            excalidrawApi.updateScene({
                elements:[
                  ...excalidrawApi.getSceneElements(),
                  element
                ]
            }) 
            return element 
        }

    }

    public static placePortal(excalidrawApi:ExcalidrawImperativeAPI) {
        return (nodePath:string,portal:HTMLElement) => {
            const element = excalidrawApi.getSceneElements().find(element => element.id == nodePath);
            const replacementRect = !!element ? element : this.insertPortalContainer(excalidrawApi)(0,0,nodePath)
            this.positionPortal(portal, replacementRect as ExcalidrawRectangleElement, excalidrawApi.getAppState());
        }
    }

    private static getMargin(value:number,appState:AppState){
        return (value * PADDING * appState.zoom.value)/2
    }

    private static getXYPosition(element:ExcalidrawRectangleElement,appState:AppState) {
        const xPosition = (element.x + appState.scrollX) * appState.zoom.value + appState.offsetLeft
        const yPosition = (element.y + appState.scrollY) * appState.zoom.value + appState.offsetTop 
        const sceneX = element.x
        const sceneY = element.y
        return sceneCoordsToViewportCoords({sceneX, sceneY},appState)
       //return {xPosition,yPosition}
    }
    
    private static getDimension(dimension:number,appState:AppState) {
        return dimension * ( 1 - PADDING )
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

