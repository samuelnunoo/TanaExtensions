import { Maybe } from "purify-ts/Maybe";
import PanelStateHandler from "./PanelStateHandler";
import PanelMutationHandler from './PanelMutationHandler';
import TanaConstants from "../../StaticModules/TanaDomNodeProvider/TanaConstants";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";


export default new class PanelObserverRegistrationHandler extends TanaConstants {

    public observeMainDockPanel(panelStateHandler:PanelStateHandler, mainDock:HTMLElement) {
        const panel = TanaDomNodeProvider.getPanelFromAncestor(mainDock)
        if (!panel) throw Error("Cannot from Main Panel from Dock")
        panelStateHandler.getMainDockObserver().observe(mainDock,{ childList:true })
    }

    public unObserveMainDockPanel(panelStateHandler:PanelStateHandler) {
        panelStateHandler.getMainDockObserver().disconnect()
    }

    public observeDockContainer(panelStateHandler:PanelStateHandler, dockContainer:HTMLElement) {
        panelStateHandler.getDockContainerObserver().observe(dockContainer, { childList: true })
    }

    public unObserveDockContainer(panelStateHandler:PanelStateHandler) {
        panelStateHandler.getDockContainerObserver().disconnect()
    }
  
    public observeDescendantsOfDocks(
        docks:HTMLElement[],
        panelStateHandler:PanelStateHandler,
        panelMutationHandler:PanelMutationHandler
    ) {
        docks.forEach(dock => {
            Maybe.fromNullable(TanaDomNodeProvider.getPanelContainerFromDock(dock))
                .map(panelContainer => ({panelContainer, panels:Array.from(panelContainer.childNodes) as HTMLElement[]}))
                .map(({panelContainer,panels}) => {
                    this.observeDockPanelContainers([panelContainer],panelMutationHandler,panelStateHandler)
                    this.observePanels(panels,panelMutationHandler,panelStateHandler)
                })
        })

    }

    public unobserveDescendantsOfDocks(
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

    public observePanels(
        panels:HTMLElement[],
        panelMutationHandler: PanelMutationHandler,
        panelStateHandler: PanelStateHandler
    ) {
        panels.forEach(panel => {
            this.unObservePanels([panel],panelStateHandler)
            const mutationObserver = new MutationObserver(panelMutationHandler.panelIdChangeMutationHandler)
            mutationObserver.observe(panel,{ attributeFilter: [this.getPanelAttribute()] })
            panelStateHandler.addPanelObserver(panel,mutationObserver)

            const panelHeaderMutationObserver = new MutationObserver(panelMutationHandler.panelHeaderChangeMutationHandler)
            Maybe.fromNullable(TanaDomNodeProvider.getPanelHeaderFromAncestor(panel))
                .map(panelHeader => panelHeaderMutationObserver.observe(panelHeader,{ subtree:true, childList:true }))
                .map( _ => panelStateHandler.addPanelHeaderObserver(panel,panelHeaderMutationObserver))
        })
    }

    public unObservePanels(
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
        panelMutationHandler:PanelMutationHandler,
        panelStateHandler:PanelStateHandler
    ) {
        panelContainers.forEach(panelContainer => {
            this.unObserveDockPanelContainers([panelContainer],panelStateHandler)
            const mutationObserver = new MutationObserver(panelMutationHandler.handlePanelContainerChildListMutationEvent)
            mutationObserver.observe(panelContainer,{ childList:true })
            panelStateHandler.addPanelContainerObserver(panelContainer,mutationObserver)
        })
    }

    public unObserveDockPanelContainers(panelContainers:HTMLElement[],panelStateHandler:PanelStateHandler) {
        panelContainers.forEach(panelContainer => {
            Maybe.fromNullable(panelStateHandler.getPanelContainerObserver(panelContainer))
                .map(panelContainerObserver => panelContainerObserver.disconnect())
                .map(_ => panelStateHandler.removePanelContainerObserver(panelContainer))
        })
    }

}