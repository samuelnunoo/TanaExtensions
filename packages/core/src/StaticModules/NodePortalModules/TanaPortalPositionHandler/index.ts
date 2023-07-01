




export default class TanaPortalPositionHandler {


    public static moveToViewPortCoordinates(portal:HTMLElement,portalContainerDomRect:DOMRect,top:number,left:number) {
        const offsetTop = ( portalContainerDomRect.top - top ) * -1
        const offsetLeft = ( portalContainerDomRect.left - left ) * -1 
        portal.style.left = `${offsetLeft}px`
        portal.style.top = `${offsetTop}px`
        portal.style.position = "absolute"
    }


}