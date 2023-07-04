import NodePortal from "../NodePortal"


export default class TanaPortalPositionHandler {

    public static moveToViewPortCoordinates(nodePortal:NodePortal,portalContainerDomRect:DOMRect,top:number,left:number) {
        const portalElement = nodePortal.getPortalDomNode()
        const offsetTop = ( portalContainerDomRect.top - top ) * -1
        const offsetLeft = ( portalContainerDomRect.left - left ) * -1 
        portalElement.style.left = `${offsetLeft}px`
        portalElement.style.top = `${offsetTop}px`
        portalElement.style.position = "absolute"
    }

    public static clipOutOfBoundPortalSegments(nodePortal:NodePortal,referenceElement:HTMLElement) {
        const referenceDomRect = referenceElement.getBoundingClientRect()
        const portalElement = nodePortal.getPortalDomNode()
        const portalDomRect = portalElement.getBoundingClientRect()

        const widthScale = portalDomRect.width / portalElement.clientWidth
        const heightScale = portalDomRect.height / portalElement.clientHeight

        const topClip = (referenceDomRect.top - portalDomRect.top) / heightScale
        const rightClip = (portalDomRect.right - referenceDomRect.right)  / widthScale
        const bottomClip = (portalDomRect.bottom - referenceDomRect.bottom) / heightScale
        const leftClip = (referenceDomRect.left - portalDomRect.left) / widthScale
        portalElement.style.clipPath = `inset(${topClip}px ${rightClip}px ${bottomClip}px ${leftClip}px)`
    }


}