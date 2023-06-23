import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import TanaPanelEventModule from "./index";
import PanelEvent, {PanelEventMessage} from "./types/PanelEvent";
import DomNodePublisherInitEvent from "../TanaNodeEventModule/types/DomNodePublisherInitEvent";
import PanelObserverRegistrationHandler from "./PanelObserverRegistrationHandler";
import { PanelContainerType, PanelEvenTypeEnum } from "./types/types";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector";
import OnDomRenderCompleteEvent from "../TanaLoaderModule/types/OnDomRenderCompleteEvent";

export default class PanelEventPublisher extends TanaPublisher<TanaPanelEventModule> {

    getInitRequirements(): InitEvent[] {
        return [
            DomNodePublisherInitEvent,
            OnDomRenderCompleteEvent,
        ];
    }
    
    onDependenciesInitComplete() {
        this.initObservers()
        this.invokeInitialPanelEvents()
    }

    public dispatchPanelEvent(panel:HTMLElement, panelContainer:HTMLElement, panelId:string, isRemoval:boolean) {
        const panelEventMessage = this.createPanelEvent(panel,panelContainer,panelId,isRemoval)
        this.dispatchRuntimeEvent(PanelEvent.createInstance(panelEventMessage))
    }

    private createPanelEvent(panel:HTMLElement,panelContainer:HTMLElement,panelId:string,isRemoval:boolean) {
        const panelContainerType = this.getPanelContainerType(panelContainer)
        const panelEventType = isRemoval ? PanelEvenTypeEnum.Deletion : PanelEvenTypeEnum.Insertion
        return {
            panelId,
            panel,
            panelContainerType,
            panelEventType
        } as PanelEventMessage
    }

    private initObservers() {
        const dockContainer = TanaDomNodeProvider.getDockContainer(document) as HTMLElement
        if (!dockContainer) throw Error("dockContainer not Found")
        const panelStateHandler = this.mediator.getPanelStateHandler()
        const panelMutationHandler = this.mediator.getPanelMutationHandler()
        PanelObserverRegistrationHandler.observeDockContainer(panelStateHandler,panelMutationHandler,dockContainer)

    }

    private invokeInitialPanelEvents() {
        const dockContainer = TanaDomNodeProvider.getDockContainer(document) as HTMLElement
        if (!dockContainer) throw Error("DockContainer not found")
        const docks = Array.from(dockContainer.childNodes) as HTMLElement[]
        docks.forEach(dock => {
            this.mediator.getPanelMutationHandler().invokeEventFromDock(dock,false)
        })
    }

    private getPanelContainerType(panelContainer:HTMLElement): PanelContainerType|null {
        if (TanaNodeAttributeInspector.isMainPanelContainer(panelContainer)) {
            return PanelContainerType.MainPanelContainer
        }

        if (TanaNodeAttributeInspector.isTopPanelContainer(panelContainer)) {
            return PanelContainerType.TopPanelContainer
        }

        if (TanaNodeAttributeInspector.isRightPanelContainer(panelContainer)) {
            return PanelContainerType.RightPanelContainer
        }

        return null
    }

}