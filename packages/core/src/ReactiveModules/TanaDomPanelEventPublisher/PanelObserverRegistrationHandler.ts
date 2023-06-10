import PanelStateHandler from './PanelStateHandler';
import PanelMutationHandler from './PanelMutationHandler';
import TanaConstants from "../../StaticModules/TanaDomNodeProvider/TanaConstants";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";


export default new class PanelObserverRegistrationHandler extends TanaConstants {

    public observeDockContainer(panelStateHandler:PanelStateHandler, panelMutationHandler: PanelMutationHandler, dockContainer:HTMLElement) {
        panelStateHandler.getDockContainerObserver().observe(dockContainer, { childList: true })
        const docks = Array.from(dockContainer.childNodes) as HTMLElement[]
        docks.forEach(dock => this.observeDock(panelStateHandler,panelMutationHandler,dock))
    }

    public observeDock(panelStateHandler:PanelStateHandler,panelMutationHandler:PanelMutationHandler,dock:HTMLElement) {
        panelStateHandler.removeDockObserver(dock)
        const mutationObserver = new MutationObserver(panelMutationHandler.handleDockChildListMutationEvent)
        panelStateHandler.addDockObserver(dock,mutationObserver)
        const panelContainer = TanaDomNodeProvider.getPanelContainerFromDock(dock)
        if (!panelContainer) throw Error("Could not retrieve panel container from dock")
        this.observeDockPanelContainers([panelContainer],panelMutationHandler,panelStateHandler)
    }

    public unObserveDock(panelStateHandler:PanelStateHandler, dock:HTMLElement) {
        panelStateHandler.removeDockObserver(dock)
        const panelContainer = TanaDomNodeProvider.getPanelContainerFromDock(dock)
        if (!panelContainer) throw Error("Could not retrieve panel container from dock")
        this.unObserveDockPanelContainers([panelContainer],panelStateHandler)
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
            this.observePanelHeader(panelContainer,panelMutationHandler,panelStateHandler)
        })
    }

    public unObserveDockPanelContainers(panelContainers:HTMLElement[],panelStateHandler:PanelStateHandler) {
        panelContainers.forEach(panelContainer => {
            panelStateHandler.removePanelContainerObserver(panelContainer)
            this.unObservePanelHeader(panelContainer,panelStateHandler)
        })
    }

    public observePanelHeader(panelContainer:HTMLElement,panelMutationHandler:PanelMutationHandler,panelStateHandler:PanelStateHandler) {
        const panelHeaderTemplateContainer = 
            TanaDomNodeProvider.getPanelHeaderTemplateContainerFromPanelContainer(panelContainer)
        if (!panelHeaderTemplateContainer) return 
        const mutationObserver = new MutationObserver(panelMutationHandler.panelHeaderChangeMutationHandler)
        mutationObserver.observe(panelHeaderTemplateContainer,{childList: true})
        panelStateHandler.addPanelHeaderObserver(panelContainer,mutationObserver)
    }

    public unObservePanelHeader(panelContainer:HTMLElement,panelStateHandler:PanelStateHandler) {
        panelStateHandler.removePanelHeaderObserver(panelContainer)
    }
}