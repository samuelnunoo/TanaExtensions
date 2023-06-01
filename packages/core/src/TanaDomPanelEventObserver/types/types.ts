

export enum PanelEventEnum {
    PanelIdChangeEvent,
    PanelAddedEvent,
    PanelRemovedEvent,
}

export enum PanelContainerType {
    MainPanelContainer,
    TopPanelContainer,
    RightPanelContainer,
}

export enum PanelEvenTypeEnum {
    Insertion,
    Deletion,
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