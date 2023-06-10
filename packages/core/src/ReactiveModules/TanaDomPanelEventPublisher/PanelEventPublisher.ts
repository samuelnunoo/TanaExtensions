import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import TanaDomPanelEventPublisher from "./index";
import PanelEvent, {PanelEventMessage} from "./types/PanelEvent";
import DomNodePublisherInitEvent from "../TanaDomNodeEventPublisher/types/DomNodePublisherInitEvent";
import { Maybe } from "purify-ts";
import PanelObserverRegistrationHandler from "./PanelObserverRegistrationHandler";
import { PanelContainerType, PanelEvenTypeEnum } from "./types/types";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector";

export default class PanelEventPublisher extends TanaPublisher<TanaDomPanelEventPublisher> {

    getInitRequirements(): InitEvent[] {
        return [
            DomNodePublisherInitEvent
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
        const mainDock = TanaDomNodeProvider.getMainDock(document)as HTMLElement
        if (!mainDock) throw Error("mainDock not Found")
        
        const docks = Array.from(dockContainer.childNodes)as HTMLElement[]
        const panelStateHandler = this.mediator.getPanelStateHandler()
        const panelMutationHandler = this.mediator.getPanelMutationHandler()

        PanelObserverRegistrationHandler.observeDockContainer(panelStateHandler,dockContainer)
        PanelObserverRegistrationHandler.observeMainDockPanel(panelStateHandler,mainDock)
        PanelObserverRegistrationHandler.observeDescendantsOfDocks(docks,panelStateHandler,panelMutationHandler)
    }

    private invokeInitialPanelEvents() {
        const dockContainer = TanaDomNodeProvider.getDockContainer(document) as HTMLElement
        if (!dockContainer) throw Error("DockContainer not found")
        const docks = Array.from(dockContainer.childNodes) as HTMLElement[]

        docks.forEach(dock => {
            Maybe.fromNullable(TanaDomNodeProvider.getPanelContainerFromDock(dock) as HTMLElement)
                .map(panelContainer => ({panelContainer,panels:Array.from(panelContainer!.childNodes) as HTMLElement[]}))
                .map(({panels,panelContainer}) => panels.forEach(panel => this.invokeInitialPanelEvent(panel,panelContainer)))
        })
    }

    private invokeInitialPanelEvent(panel:HTMLElement,panelContainer:HTMLElement) {
        Maybe.fromNullable(TanaNodeAttributeInspector.getPanelId(panel))
            .map(dataPanelId => {
                this.dispatchPanelEvent(panel,panelContainer,dataPanelId,false)
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