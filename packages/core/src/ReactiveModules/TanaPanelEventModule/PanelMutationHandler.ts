import TanaPanelEventModule from "."
import PanelObserverRegistrationHandler from "./PanelObserverRegistrationHandler"
import { Maybe } from "purify-ts"
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider"
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector"
import autoBind from "auto-bind"
export default class PanelMutationHandler {
    mediator:TanaPanelEventModule

    constructor(mediator:TanaPanelEventModule) {
        this.mediator = mediator
        autoBind(this)
    }
    
    /*
    Here the mutation.target is the panelHeader and the desired mutations are templateButtons 
    */
    public panelHeaderChangeMutationHandler(mutationList:MutationRecord[]) {
        for (const mutation of mutationList) {
            const templateContainer = mutation.target
            const panel = TanaDomNodeProvider.getPanelFromDescendant(templateContainer as HTMLElement) as HTMLElement
            if (!panel) return
            const panelContainer = panel.parentElement
            if (!panelContainer) return
            const dataPanelId =  TanaNodeAttributeInspector.getPanelId(panel)
            if (!dataPanelId) return

            this.mediator.dispatchPanelEvent(panel,panelContainer,dataPanelId,true)
            this.mediator.dispatchPanelEvent(panel,panelContainer,dataPanelId,false)
        }
    }

    /*
        this should have all the docks that are added and removed 
    */
    public handleDockContainerChildListMutationEvent(mutationList: MutationRecord[]) {
        for (const mutation of mutationList) {
            const removedDocks = Array.from(mutation.removedNodes) as HTMLElement[]
            const addedDocks = Array.from(mutation.addedNodes) as HTMLElement[]
            const panelStateHandler = this.mediator.getPanelStateHandler()

            removedDocks.forEach(dock => {
                PanelObserverRegistrationHandler.unObserveDock(panelStateHandler,dock)
            })

            addedDocks.forEach(dock => {
                PanelObserverRegistrationHandler.observeDock(panelStateHandler,this,dock)
            })

            removedDocks.forEach(dock => {
                this.invokeEventFromDock(dock,true)
            })

            addedDocks.forEach(dock => {
                this.invokeEventFromDock(dock,false)
            })
        }
    }

    public handlePanelContainerChildListMutationEvent(mutationList: MutationRecord[]) {
        for (const mutation of mutationList) {
            const removedPanels = Array.from(mutation.removedNodes) as HTMLElement[]
            const addedPanels = Array.from(mutation.addedNodes) as HTMLElement[]
            const panelContainer = mutation.target as HTMLElement

            removedPanels.forEach(panel => this.invokePanelEvent(panel,panelContainer,true))
            addedPanels.forEach(panel => this.invokePanelEvent(panel,panelContainer,false))
        }
    }

    public handleDockChildListMutationEvent(mutationList: MutationRecord[]) {
        const panelStateHandler = this.mediator.getPanelStateHandler()
        for (const mutation of mutationList) {
            const addedPanelContainers = Array.from(mutation.addedNodes) as HTMLElement[]
            const removedPanelContainers = Array.from(mutation.removedNodes) as HTMLElement[]

            PanelObserverRegistrationHandler.unObserveDockPanelContainers(removedPanelContainers,panelStateHandler)
            PanelObserverRegistrationHandler.observeDockPanelContainers(addedPanelContainers,this,panelStateHandler)

            addedPanelContainers.forEach(panelContainer => this.invokePanelEventsFromPanelContainer(panelContainer,false))
            removedPanelContainers.forEach(panelContainer => this.invokePanelEventsFromPanelContainer(panelContainer,true))
        }
    }

    public invokeEventFromDock(dock: HTMLElement,isRemoval:boolean) {
        const panelContainer = TanaDomNodeProvider.getPanelContainerFromDock(dock)
        if (!panelContainer) throw Error("Can not find Panel Container from Dock")
        this.invokePanelEventsFromPanelContainer(panelContainer, isRemoval)
    }

    private invokePanelEvent(panel: HTMLElement, panelContainer: HTMLElement, isRemoval: boolean) {
        Maybe.fromNullable(TanaNodeAttributeInspector.getPanelId(panel))
            .map(dataPanelId => {
                this.mediator.dispatchPanelEvent(
                    panel, panelContainer, dataPanelId, isRemoval
                )
            })
    }
    
    private invokePanelEventsFromPanelContainer(panelContainer:HTMLElement,isRemoval:boolean) {
        const panels = TanaDomNodeProvider.getDescendantPanels(panelContainer)
        panels.forEach(panel => this.invokePanelEvent(panel,panelContainer,isRemoval))
    }


}