import NodePortal from "../../../StaticModules/NodePortalModules/NodePortal";


export default interface INodePortalListener {

    onPortalPresenceChange(portal:NodePortal,isRemoved:boolean):void 
}