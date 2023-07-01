
export default class ExcalidrawPortalStateHandler {
        private state:Map<string,{width:number,height:number}> = new Map() 


        setPortalDomRect(portalId:string, domRect:{width:number,height:number}) {
            this.state.set(portalId,domRect)
        }

        getPortalDomRect(portalId:string) {
            return this.state.get(portalId)
        }

}