import {
    TANA_DATA_PANEL_ATTRIBUTE
} from "../types/constants";
import TanaDomNodeProvider from "../../../StaticModules/TanaDomNodeProvider";
import { Maybe } from "purify-ts/Maybe";
import { MutationHandler } from "../types/types";
import PanelStateHandler from "../PanelStateHandler";

export default class PanelObserverRegistrationHandler {
    private panelContainerObservers: Map<HTMLElement,MutationObserver> = new Map()


    public observePanels(
        panels:HTMLElement[],
        panelIdChangeMutationHandler:MutationHandler,
        panelHeaderChangeMutationHandler:MutationHandler,
        panelStateHandler: PanelStateHandler
    ) {

        panels.forEach(panel => {
            this.unobservePanels([panel],panelStateHandler)

            const mutationObserver = new MutationObserver(panelIdChangeMutationHandler)
            mutationObserver.observe(panel,{ attributeFilter: [TANA_DATA_PANEL_ATTRIBUTE] })
            panelStateHandler.addPanelObserver(panel,mutationObserver)
            const panelHeaderMutationObserver = new MutationObserver(panelHeaderChangeMutationHandler)
            Maybe.fromNullable(TanaDomNodeProvider.getPanelHeaderTemplateContainerFromPanel(panel))
                .map(panelTemplateContainer => panelHeaderMutationObserver.observe(panelTemplateContainer,{ childList:true }))
            panelHeaderObservers.set(panel,panelHeaderMutationObserver)
        })
    }

    public unobservePanels(
        panels:HTMLElement[],
        panelStateHandler: PanelStateHandler

        ) {
            const panelObservers = 
        panels.forEach(panel => {
            if (panelObservers.has(panel)) {
                panelObservers.get(panel)!.disconnect()
                panelObservers.delete(panel)
            }
            if (panelHeaderObservers.has(panel)) {
                panelHeaderObservers.get(panel)!.disconnect()
                panelHeaderObservers.delete(panel)
            }
        })
    }

    public observeDockPanelContainers(
        panelContainers:HTMLElement[],
        panelContainerChildListMutationHandler:MutationHandler
        ) {
        panelContainers.forEach(panelContainer => {
            this.unobserveDockPanelContainers([panelContainer])
            const mutationObserver = new MutationObserver(panelContainerChildListMutationHandler)
            mutationObserver.observe(panelContainer,{ childList:true })
            this.panelContainerObservers.set(panelContainer,mutationObserver)
        })
    }

    public unobserveDockPanelContainers(panelContainers:HTMLElement[]) {
        panelContainers.forEach(panelContainer => {
            if (this.panelContainerObservers.has(panelContainer)) {
                this.panelContainerObservers.get(panelContainer)!.disconnect()
                this.panelContainerObservers.delete(panelContainer)
            }
        })
    }

}