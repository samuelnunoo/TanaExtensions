import { sceneCoordsToViewportCoords, viewportCoordsToSceneCoords } from "@excalidraw/excalidraw"
import { ExcalidrawElement, ExcalidrawRectangleElement } from "@excalidraw/excalidraw/types/element/types"
import { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
import ExcalidrawPortalStateHandler from "./ExcalidrawPortalStateHandler"

const PADDING = 60

export default class ExcalidrawPortalPositionHandler {

    public static positionPortal(portalElement:HTMLElement,width:number,height:number,excalidrawRect:ExcalidrawRectangleElement,appState:AppState) {
        console.log("position portal")
        const {x,y} = this.getXYPosition(excalidrawRect,appState)
        console.log("viewport Pos",y,x)
        const {top,left} = portalElement.parentElement!.getBoundingClientRect()
        console.log("Element", top, left)
        const offsetTop = (top - y) * -1 
        const offsetLeft = (left - x) * -1
        console.log("Offset",offsetTop,offsetLeft)
        portalElement.style.left = `${ offsetLeft + this.getMargin(excalidrawRect.width,width,appState)}px` 
        portalElement.style.top = `${ offsetTop + this.getMargin(excalidrawRect.height,height,appState) }px`
        portalElement.style.fontSize = "120%"
        portalElement.style.color = "black"
        portalElement.style.width = 'fit-content' //'fit-content'
        portalElement.style.height = 'fit-content' //'fit-content'
        this.clipOutOfBoundElementSegments(portalElement,appState)
        portalElement.style.visibility = "visible"
        portalElement.style.position = "absolute"
        portalElement.style.zIndex = "2"
        portalElement.style.scale = `${appState.zoom.value}`
       // portalElement.style.transformOrigin = "top left"
        console.log(portalElement)
        const xx = portalElement.getBoundingClientRect()
        console.log("newPos", xx.top, xx.left)
    }

    public static checkElementSize(elements: readonly ExcalidrawElement[], portalState:ExcalidrawPortalStateHandler, excalidrawAPI:ExcalidrawImperativeAPI|null) {
      
    }

    public static fitRectToPortal(elements: readonly ExcalidrawElement[],portalState:ExcalidrawPortalStateHandler,excalidrawAPI:ExcalidrawImperativeAPI) {
        const els = elements.map(element => {
            const domRect = portalState.getPortalDomRect(element.id)
            if (!domRect) return element
            const zoom = excalidrawAPI.getAppState().zoom.value
            const width =  domRect.width + ( PADDING  * zoom )
            const height =  domRect.height + ( PADDING * zoom )
    
            return {
                ...element,
                width,
                height
            }
        })
        excalidrawAPI.updateScene({elements:els})
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

    public static placePortal(excalidrawApi:ExcalidrawImperativeAPI,portalState:ExcalidrawPortalStateHandler) {
        return (nodePath:string,portal:HTMLElement) => {
            const element = excalidrawApi.getSceneElements().find(element => element.id == nodePath);
            const replacementRect = !!element ? element : this.insertPortalContainer(excalidrawApi)(0,0,nodePath)
            const {width,height} = portalState.getPortalDomRect(nodePath)!
            this.positionPortal(portal,width,height, replacementRect as ExcalidrawRectangleElement, excalidrawApi.getAppState());
        }
    }

    private static getMargin(excalidrawElementDimension:number,domElementDimension:number,appState:AppState){
        return (Math.abs(excalidrawElementDimension - domElementDimension)/2) * appState.zoom.value
    }

    private static getXYPosition(element:ExcalidrawRectangleElement,appState:AppState) {
        const sceneX = element.x
        const sceneY = element.y
        return sceneCoordsToViewportCoords({sceneX, sceneY},appState)
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

