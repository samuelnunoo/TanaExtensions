import {
    TANA_DATA_PANEL_ATTRIBUTE
} from "./types/constants";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import { Maybe } from "purify-ts/Maybe";
import PanelStateHandler from "./PanelStateHandler";
import PanelMutationHandler from './PanelMutationHandler';


export default class PanelObserverRegistrationHandler {

    public static observerMainDock(panelStateHandler:PanelStateHandler, mainDock:HTMLElement) {
        panelStateHandler.getMainDockObserver().observe(mainDock,{ childList:true })
    }

    public static observeDockContainer(panelStateHandler:PanelStateHandler, dockContainer:HTMLElement) {
        panelStateHandler.getDockContainerObserver().observe(dockContainer, { childList: true })
    }

    public static unObserverMainDock(panelStateHandler:PanelStateHandler) {
        panelStateHandler.getMainDockObserver().disconnect()
    }

    public static unObserveDockContainer(panelStateHandler:PanelStateHandler) {
        panelStateHandler.getDockContainerObserver().disconnect()
    }

    public static observeDocks(
        docks:HTMLElement[],
        panelStateHandler:PanelStateHandler,
        panelMutationHandler:PanelMutationHandler
    ) {
        docks.forEach(dock => {
            Maybe.fromNullable(dock.querySelector("div"))
                .map(panelContainer => ({panelContainer, panels:Array.from(panelContainer.childNodes) as HTMLElement[]}))
                .map(({panelContainer,panels}) => {
                    this.observeDockPanelContainers([panelContainer],panelMutationHandler,panelStateHandler)
                    this.observePanels(panels,panelMutationHandler,panelStateHandler)
                })
        })
    }

    public static unobserveDocks(
        docks: HTMLElement[],
        panelStateHandler:PanelStateHandler
        ) {
        docks.forEach(dock => {
            Maybe.fromNullable(dock.querySelector("div"))
                .map(panelContainer =>({panelContainer, panels: Array.from(panelContainer!.childNodes) as HTMLElement[]}))
                .map(({panelContainer,panels}) => {
                    this.unObserveDockPanelContainers([panelContainer],panelStateHandler)
                    this.unObservePanels(panels,panelStateHandler)
                })
        })
    }

    public static observePanels(
        panels:HTMLElement[],
        panelMutationHandler: PanelMutationHandler,
        panelStateHandler: PanelStateHandler
    ) {
        panels.forEach(panel => {
            this.unObservePanels([panel],panelStateHandler)
            const mutationObserver = new MutationObserver(panelMutationHandler.panelIdChangeMutationHandler)
            mutationObserver.observe(panel,{ attributeFilter: [TANA_DATA_PANEL_ATTRIBUTE] })
            panelStateHandler.addPanelObserver(panel,mutationObserver)

            const panelHeaderMutationObserver = new MutationObserver(panelMutationHandler.panelHeaderChangeMutationHandler)
            Maybe.fromNullable(TanaDomNodeProvider.getPanelHeaderTemplateContainerFromPanel(panel))
                .map(panelTemplateContainer => panelHeaderMutationObserver.observe(panelTemplateContainer,{ childList:true }))
                .map( _ => panelStateHandler.addPanelHeaderObserver(panel,panelHeaderMutationObserver))
        })
    }

    public static unObservePanels(
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

    public static observeDockPanelContainers( 
        panelContainers:HTMLElement[],
        panelMutationHandler:PanelMutationHandler,
        panelStateHandler:PanelStateHandler
    ) {
        panelContainers.forEach(panelContainer => {
            this.unObserveDockPanelContainers([panelContainer],panelStateHandler)
            const mutationObserver = new MutationObserver(panelMutationHandler.handleDockContainerChildListMutationEvent)
            mutationObserver.observe(panelContainer,{ childList:true })
            panelStateHandler.addPanelContainerObserver(panelContainer,mutationObserver)
        })
    }

    public static unObserveDockPanelContainers(panelContainers:HTMLElement[],panelStateHandler:PanelStateHandler) {
        panelContainers.forEach(panelContainer => {
            Maybe.fromNullable(panelStateHandler.getPanelContainerObserver(panelContainer))
                .map(panelContainerObserver => panelContainerObserver.disconnect())
                .map(_ => panelStateHandler.removePanelContainerObserver(panelContainer))
        })
    }

}