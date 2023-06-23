
export default interface ExpandedNodeConfig {
    addBorder:boolean
    hideHeader:boolean
    height:string
    width:string
    lockByDefault:boolean
    onLock?:(nodeView:HTMLElement) => unknown 
    onUnlock?: (nodeView:HTMLElement) => unknown 
    addSettingsButton:boolean
    allowFullscreen:boolean

}