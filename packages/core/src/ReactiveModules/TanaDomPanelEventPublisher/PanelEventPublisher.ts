import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import TanaDomPanelEventPublisher from "./index";
import PanelEvent, {PanelEventMessage} from "./types/PanelEvent";
import DomNodePublisherInitEvent from "../TanaDomNodeEventPublisher/types/DomNodePublisherInitEvent";
import { Maybe } from "purify-ts";
import { TANA_DOCKS_CONTAINER_CSS_SELECTOR, TANA_DATA_PANEL_ATTRIBUTE, MAIN_PANEL_CSS_SELECTOR, TANA_DATA_PANEL_CSS_SELECTOR, DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME, MAIN_PANEL_CONTAINER_ATTRIBUTE_NAME, MAIN_PANEL_CONTAINER_ATTRIBUTE_VALUE, RIGHT_DOCK_ATTRIBUTE_VALUE, TOP_DOCK_ATTRIBUTE_VALUE } from "./types/constants";
import PanelObserverRegistrationHandler from "./PanelObserverRegistrationHandler";
import { PanelContainerType, PanelEvenTypeEnum } from "./types/types";


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
        const dockContainer = document.querySelector(TANA_DOCKS_CONTAINER_CSS_SELECTOR) as HTMLElement
        if (!dockContainer) throw Error("dockContainer not Found")
        const mainDock = dockContainer.querySelector(MAIN_PANEL_CSS_SELECTOR) as HTMLElement
        if (!mainDock) throw Error("mainDock not Found")
        
        const docks = Array.from(dockContainer.childNodes)as HTMLElement[]
        const panelStateHandler = this.mediator.getPanelStateHandler()
        const panelMutationHandler = this.mediator.getPanelMutationHandler()

        PanelObserverRegistrationHandler.observeDockContainer(panelStateHandler,dockContainer)
        PanelObserverRegistrationHandler.observerMainDock(panelStateHandler,mainDock)
        PanelObserverRegistrationHandler.observeDocks(docks,panelStateHandler,panelMutationHandler)
    }

    private invokeInitialPanelEvents() {
        const dockContainer = document.querySelector(TANA_DOCKS_CONTAINER_CSS_SELECTOR) as HTMLElement
        if (!dockContainer) throw Error("DockContainer not found")
        const docks = Array.from(dockContainer.childNodes) as HTMLElement[]

        docks.forEach(dock => {
            Maybe.fromNullable(dock.querySelector("div") as HTMLElement)
                .map(panelContainer => ({panelContainer,panels:Array.from(panelContainer!.childNodes) as HTMLElement[]}))
                .map(({panels,panelContainer}) => panels.forEach(panel => this.invokeInitialPanelEvent(panel,panelContainer)))
        })
    }

    private invokeInitialPanelEvent(panel:HTMLElement,panelContainer:HTMLElement) {
        Maybe.fromNullable(panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE))
            .map(dataPanelId => {
                this.dispatchPanelEvent(panel,panelContainer,dataPanelId,false)
        })
    }

    private getPanelContainerType(panelContainer:HTMLElement): PanelContainerType|null {
        if (panelContainer.hasAttribute(MAIN_PANEL_CONTAINER_ATTRIBUTE_NAME)) {
            if (panelContainer.getAttribute(MAIN_PANEL_CONTAINER_ATTRIBUTE_NAME) == MAIN_PANEL_CONTAINER_ATTRIBUTE_VALUE) {
                return PanelContainerType.MainPanelContainer
            }
        }
        if (panelContainer.hasAttribute(DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME)) {
            if (panelContainer.getAttribute(DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME) == TOP_DOCK_ATTRIBUTE_VALUE) {
                return PanelContainerType.TopPanelContainer
            }
            if (panelContainer.getAttribute(DOCK_PANEL_CONTAINER_ATTRIBUTE_NAME) == RIGHT_DOCK_ATTRIBUTE_VALUE) {
                return PanelContainerType.RightPanelContainer
            }
        }
        return null
    }

}