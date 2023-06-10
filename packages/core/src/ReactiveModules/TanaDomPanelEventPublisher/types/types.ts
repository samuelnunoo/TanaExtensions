export type MutationHandler = (mutations:MutationRecord[], observer:MutationObserver) => any 

export enum PanelEventEnum {
    PanelIdChangeEvent = "panelIdChangeEvent",
    PanelAddedEvent = "panelAddedEvent",
    PanelRemovedEvent = "panelRemovedEvent"
}

export enum PanelContainerType {
    MainPanelContainer = "mainPanelContainer",
    TopPanelContainer = "topPanelContainer",
    RightPanelContainer = "rightPanelContainer"
}

export enum PanelEvenTypeEnum {
    Insertion = "insertion",
    Deletion = "deletion"
}

export interface PanelEvent {
    panel:HTMLElement
    panelContainerType: PanelContainerType
    panelEventType: PanelEvenTypeEnum
    panelId:string
}

export interface IDomPanelListener {
    onPanelEvent(panelEvent:PanelEvent): void
}