import {TanaNode} from "../../../DataProviders/TanaStateProvider/types/types";

export enum NodeEventTypeEnum {
    Insertion,
    Deletion,
    Update
}

export const BULLET_MODULE_CLASS_PREFIX = "Bullet-module"
export const BULLET_CONTENT_CSS_SELECTOR = ".bulletAndContent"

export const EDITABLE_CSS_CLASS = "editable"
export const BULLET_CONTENT_CSS_CLASS = "bulletAndContent"
export const PANEL_CONTENT_CSS_CLASS = "panelContent"

export const NON_TEMPLATE_CSS_CLASS = "nonTemplateContent"
export const CONTENT_SIDE_CSS_CLASS = "contentSide"
export const CONTENT_SIDE_CSS_SELECTOR = ".contentSide"
export const EXPANDED_NODE_CSS_CLASS = "expandedNodeContent"

export enum NodeTargetTypeEnum {
    ContentSide,
    Editable,
    BulletAndContent,
    ExpandedNodeContent,
    PanelContent,
    NonTemplateContent
}
export interface INodeDOMListener {
    onNodeEvent(nodeEvent:NodeEvent): void
}

export interface NodeEvent {
    nodeElement: HTMLElement,
    tanaNode: TanaNode,
    nodeId: string,
    nodeEventType: NodeEventTypeEnum,
    panel: HTMLElement
    isHeaderNode:boolean
}