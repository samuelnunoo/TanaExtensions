import TanaDomPanelEventPublisher from "."
import PanelObserverRegistrationHandler from "./PanelObserverRegistrationHandler"
import { Maybe } from "purify-ts"
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider"
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector"

export default class PanelMutationHandler {
    mediator:TanaDomPanelEventPublisher

    constructor(mediator:TanaDomPanelEventPublisher) {
        this.mediator = mediator
    }
    
    //@todo Figure out if and when this is needed
    public panelIdChangeMutationHandler(mutationList:MutationRecord[]) {
        for (const mutation of mutationList) {
            console.log("invokePanelIdChangeEvent: ",mutation)
        }
    }

    /*
    Here the mutation.target is the panelHeader and the desired mutations are templateButtons 
    */
    public panelHeaderChangeMutationHandler(mutationList:MutationRecord[]) {
        for (const mutation of mutationList) {
            if (!TanaNodeAttributeInspector.elementIsDescendantOfPanelHeaderTemplateContainer(mutation.target as HTMLElement)) return 
            const isRemoval = mutation.removedNodes.length > mutation.addedNodes.length
            const element = isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]
            const panel = TanaDomNodeProvider.getPanelFromDescendant(element as HTMLElement) as HTMLElement
            if (!panel) return
            const panelContainer = panel.parentElement
            if (!panelContainer) return
            const dataPanelId =  TanaNodeAttributeInspector.getPanelId(panel)
            if (!dataPanelId) return

            this.mediator.dispatchPanelEvent(panel,panelContainer,dataPanelId,isRemoval)
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

            PanelObserverRegistrationHandler.unobserveDescendantsOfDocks(removedDocks,panelStateHandler)
            PanelObserverRegistrationHandler.observeDescendantsOfDocks(addedDocks,panelStateHandler,this)
            removedDocks.forEach(dock => this.invokeEventForDockDescendants(dock,true))
            addedDocks.forEach(dock => this.invokeEventForDockDescendants(dock,false))
        }
    }

    public handlePanelContainerChildListMutationEvent(mutationList: MutationRecord[]) {
        const panelStateHandler = this.mediator.getPanelStateHandler()
        const panelMutationHandler = this.mediator.getPanelMutationHandler()
        for (const mutation of mutationList) {
            const removedPanels = Array.from(mutation.removedNodes) as HTMLElement[]
            const addedPanels = Array.from(mutation.addedNodes) as HTMLElement[]

            PanelObserverRegistrationHandler.unObservePanels(removedPanels,panelStateHandler)
            PanelObserverRegistrationHandler.observePanels(addedPanels, panelMutationHandler,panelStateHandler)
            removedPanels.forEach(panel => this.invokeEventForPanel(panel,true))
            addedPanels.forEach(panel => this.invokeEventForPanel(panel,false))
        }
    }

    private invokeEventForPanel(panel:HTMLElement,isRemoval:boolean) {
        const panelContainer = panel.parentElement
        if (!panelContainer) throw Error("Could not find PanelContainer from Panel")

        Maybe.fromNullable(TanaNodeAttributeInspector.getPanelId(panel))
            .map(dataPanelId => {
                this.mediator.dispatchPanelEvent(
                    panel, panelContainer, dataPanelId, isRemoval,
                )
            })
    }

    private invokeEventForDockDescendants(dock:HTMLElement,isRemoval:boolean) {
        const panelContainer = TanaDomNodeProvider.getPanelContainerFromDock(dock)
        if (!panelContainer) throw Error("Cant find panelContainer for Dock")
        const panels = Array.from(panelContainer.childNodes) as HTMLElement[]
        panels.forEach(panel => this.invokeEventForPanel(panel,isRemoval))
    }

}