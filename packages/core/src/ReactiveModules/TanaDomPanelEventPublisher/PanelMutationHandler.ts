import TanaDomPanelEventPublisher from "."
import PanelObserverRegistrationHandler from "./PanelObserverRegistrationHandler"
import MutationRecordAttributeInspector from "../../StaticModules/MutationRecordAttributeInspector"
import { Maybe } from "purify-ts"
import { TANA_DATA_PANEL_CSS_SELECTOR, TANA_DATA_PANEL_ATTRIBUTE } from "./types/constants"
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider"

export default class PanelMutationHandler {
    mediator:TanaDomPanelEventPublisher

    constructor(mediator:TanaDomPanelEventPublisher) {
        this.mediator = mediator
    }
    
    //@todo Figure out if and when this is needed
    public panelIdChangeMutationHandler(mutationList:MutationRecord[]) {
        for (const mutation of mutationList) {
            const isRemove = mutation.removedNodes.length > 0
            console.log("invokePanelIdChangeEvent: ",mutation)
        }
    }

    public panelHeaderChangeMutationHandler(mutationList:MutationRecord[]) {
        for (const mutation of mutationList) {
            const isRemoval = mutation.removedNodes.length > mutation.addedNodes.length
            const element = isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]
            const panel = TanaDomNodeProvider.getPanelFromDescendant(element as HTMLElement)
            if (!panel) return
            const panelContainer = panel.parentElement
            if (!panelContainer) return
            const dataPanelId = panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE)
            if (!dataPanelId) return
            this.mediator.dispatchPanelEvent(panel,panelContainer,dataPanelId,isRemoval)
        }
    }

    public handleDockContainerChildListMutationEvent(mutationList: MutationRecord[]) {
        for (const mutation of mutationList) {
            const removedDocks = Array.from(mutation.removedNodes) as HTMLElement[]
            const addedDocks = Array.from(mutation.addedNodes) as HTMLElement[]
            const panelStateHandler = this.mediator.getPanelStateHandler()
            PanelObserverRegistrationHandler.unobserveDocks(removedDocks,panelStateHandler)
            PanelObserverRegistrationHandler.observeDocks(addedDocks,panelStateHandler,this)
            this.invokeDockEvent(mutation)
        }
    }

    public handleMainDockChildListMutationEvent(mutationList: MutationRecord[]) {
        for (const mutation of mutationList) {
            if (!MutationRecordAttributeInspector.mutationInvolvesPanelContainer(mutation)) continue
            const isRemove = mutation.removedNodes.length > 0
            const panelContainer = mutation.target as HTMLElement
            const panel = panelContainer.querySelector(TANA_DATA_PANEL_CSS_SELECTOR) as HTMLElement

            Maybe.fromNullable(panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE))
                .map(dataPanelId => {
                    this.mediator.dispatchPanelEvent(
                        panel, panelContainer,dataPanelId,isRemove
                    )
                })
        }
    }

    private invokeDockEvent(mutation:MutationRecord) {
        const isRemoval = mutation.removedNodes.length > 0
        const panelContainer = (isRemoval ? mutation.removedNodes[0] : mutation.addedNodes[0]) as HTMLElement
        const panel = panelContainer.querySelector(TANA_DATA_PANEL_CSS_SELECTOR) as HTMLElement

        Maybe.fromNullable(panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE))
            .map(dataPanelId => {
                this.mediator.dispatchPanelEvent(
                    panel, panelContainer, dataPanelId, isRemoval,
                )
            })
    }

}