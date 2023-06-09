import {
    TANA_DATA_PANEL_ATTRIBUTE
} from "../types/constants";
import TanaDomNodeProvider from "../../../StaticModules/TanaDomNodeProvider";
import { Maybe } from "purify-ts/Maybe";
import { MutationHandler } from "../types/types";
import PanelStateHandler from "../PanelStateHandler";
import PanelMutationHandler from "../PanelMutationHandler";


export default class PanelObserver {
  
    public static observeDocks(
        docks:HTMLElement[],
        observeDockPanelContainers: (panelContainers:HTMLElement[]) => void,
        observePanels: (panels:HTMLElement[]) => void 
    ) {
        docks.forEach(dock => {
            Maybe.fromNullable(dock.querySelector("div"))
                .map(panelContainer => ({panelContainer, panels:Array.from(panelContainer.childNodes) as HTMLElement[]}))
                .map(({panelContainer,panels}) => {
                    observeDockPanelContainers([panelContainer])
                    observePanels(panels)
                })
        })
    }

     
    public static unobserveDocks(
        docks: HTMLElement[],
        unObserveDockPanelContainers: (panelContainers: HTMLElement[]) => any,
        unObservePanels: (panels: HTMLElement[]) => any 
        ) {
        docks.forEach(dock => {
            Maybe.fromNullable(dock.querySelector("div"))
                .map(panelContainer =>({panelContainer, panels: Array.from(panelContainer!.childNodes) as HTMLElement[]}))
                .map(({panelContainer,panels}) => {
                    unObserveDockPanelContainers([panelContainer])
                    unObservePanels(panels)
                })
        })
    }
    

    public observePanels(
        panels:HTMLElement[],
        panelMutationHandler: PanelMutationHandler,
        panelStateHandler: PanelStateHandler
    ) {
        panels.forEach(panel => {
            this.unobservePanels([panel],panelStateHandler)
            const mutationObserver = new MutationObserver(panelMutationHandler.panelIdChangeMutationHandler)
            mutationObserver.observe(panel,{ attributeFilter: [TANA_DATA_PANEL_ATTRIBUTE] })
            panelStateHandler.addPanelObserver(panel,mutationObserver)

            const panelHeaderMutationObserver = new MutationObserver(panelMutationHandler.panelHeaderChangeMutationHandler)
            Maybe.fromNullable(TanaDomNodeProvider.getPanelHeaderTemplateContainerFromPanel(panel))
                .map(panelTemplateContainer => panelHeaderMutationObserver.observe(panelTemplateContainer,{ childList:true }))
                .map( _ => panelStateHandler.addPanelHeaderObserver(panel,panelHeaderMutationObserver))
        })
    }

    public unobservePanels(
        panels:HTMLElement[],
        panelStateHandler: PanelStateHandler
        ) {
        panels.forEach(panel => {
            Maybe.fromNullable(panelStateHandler.getPanelObserver(panel))
                .map(panelObserver => panelObserver.disconnect())
                .map(_ => panelStateHandler.removePanelObserver(panel))

            Maybe.fromNullable(panelStateHandler.getPanelHeaderObserver(panel))
                .map(panelHeaderObserver => panelHeaderObserver.disconnect())
                .map(_ => panelStateHandler.removePanelHeaderObserver(panel))
        })
    }

    public observeDockPanelContainers( 
        panelContainers:HTMLElement[],
        panelContainerChildListMutationHandler:MutationHandler,
        panelStateHandler:PanelStateHandler
    ) {
        panelContainers.forEach(panelContainer => {
            this.unobserveDockPanelContainers([panelContainer],panelStateHandler)
            const mutationObserver = new MutationObserver(panelContainerChildListMutationHandler)
            mutationObserver.observe(panelContainer,{ childList:true })
            this.panelContainerObservers.set(panelContainer,mutationObserver)
        })
    }

    public unobserveDockPanelContainers(panelContainers:HTMLElement[],panelStateHandler:PanelStateHandler) {
        panelContainers.forEach(panelContainer => {
            Maybe.fromNullable(panelStateHandler.getPanelContainerObserver(panelContainer))
                .map(panelContainerObserver => panelContainerObserver.disconnect())
                .map(_ => panelStateHandler.removePanelContainerObserver(panelContainer))
        })
    }

}