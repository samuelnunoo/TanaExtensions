
export default interface DefaultNodeConfig {
    insertBeforeTemplateContent:boolean
    addBorder:boolean
    expandNodePortalsByDefault:boolean 
    lockByDefault:boolean
    expandByDefault:boolean
    onLock:(nodeView:HTMLElement) => unknown | null
    onUnlock:(nodeView:HTMLElement) => unknown | null
    height:string
    width:string
    addSettingsButton:boolean
    hideHeaderByDefault:boolean
    allowFullscreen:boolean
}