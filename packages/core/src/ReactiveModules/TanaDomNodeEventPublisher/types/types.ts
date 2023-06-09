import RuntimeEventInstance from "../../EventBus/types/RuntimeEventInstance";
import {NodeEventMessage} from "./NodeEvent";

export enum NodeEventTypeEnum {
    Insertion = "insertion",
    Deletion = "deletion",
    Update = "update",
    BulletCollapse = "bulletCollapse",
    BulletExpand = "bulletExpand"
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
    ContentSide = "contentSide",
    Editable = "editable",
    BulletAndContent = "bulletAndContent",
    ExpandedNodeContent = "expandedNodeContent",
    PanelContent = "panelContent",
    NonTemplateContent = "nonTemplateContent"
}
export interface INodeDOMListener {
    onNodeEvent(nodeEvent:RuntimeEventInstance<NodeEventMessage>): void
}



