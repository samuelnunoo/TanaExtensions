
export default class ExcalidrawPortalStateHandler {
        private state:Map<string,{width:number,height:number}> = new Map() 


        setPortalDomRect(nodePath:string, domRect:{width:number,height:number}) {
            this.state.set(nodePath,domRect)
        }

        getPortalDomRect(nodePath:string) {
            return this.state.get(nodePath)
        }

}