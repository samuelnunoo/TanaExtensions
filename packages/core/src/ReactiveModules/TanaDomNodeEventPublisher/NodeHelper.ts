import {
    BULLET_CONTENT_CSS_CLASS, BULLET_CONTENT_CSS_SELECTOR,
    CONTENT_SIDE_CSS_CLASS,
    EDITABLE_CSS_CLASS, EXPANDED_NODE_CSS_CLASS, NodeEventTypeEnum,
    NodeTargetTypeEnum, NON_TEMPLATE_CSS_CLASS,
    PANEL_CONTENT_CSS_CLASS
} from "./types/types";
import {TANA_DATA_PANEL_CSS_SELECTOR} from "../TanaDomPanelEventPublisher/types/constants";
import {PanelEvenTypeEnum} from "../TanaDomPanelEventPublisher/types/types";
import {TANA_WRAPPER_CSS_SELECTOR} from "../../StaticModules/TanaDomNodeProvider/types";


export default class NodeHelper {
    public static getTargetType(target:HTMLElement) {
        if (!('classList' in target)) return null
        if (target.classList.contains(CONTENT_SIDE_CSS_CLASS)) return NodeTargetTypeEnum.ContentSide
        if (target.classList.contains(BULLET_CONTENT_CSS_CLASS)) return NodeTargetTypeEnum.BulletAndContent
        if (target.classList.contains(EDITABLE_CSS_CLASS)) return NodeTargetTypeEnum.Editable
        if (target.classList.contains(PANEL_CONTENT_CSS_CLASS)) return NodeTargetTypeEnum.PanelContent
        if (target.classList.contains(NON_TEMPLATE_CSS_CLASS)) return NodeTargetTypeEnum.NonTemplateContent
        if (target.classList.contains(EXPANDED_NODE_CSS_CLASS)) return NodeTargetTypeEnum.ExpandedNodeContent
        return null
    }

    public static getNodeEventType(panelEventType:PanelEvenTypeEnum) {
        return panelEventType == PanelEvenTypeEnum.Deletion
            ? NodeEventTypeEnum.Deletion :
            panelEventType == PanelEvenTypeEnum.Insertion ? NodeEventTypeEnum.Insertion
                : NodeEventTypeEnum.Update
    }

    public static getWrapAndEditableNodeElementFromParent(element:HTMLElement) {
        return element.querySelector(TANA_WRAPPER_CSS_SELECTOR)
    }
    public static getBulletAndContentNodeElementFromDescendant(target:HTMLElement, element:HTMLElement, targetType:NodeTargetTypeEnum) {
        switch(targetType) {
            case NodeTargetTypeEnum.Editable:
                return target.closest(BULLET_CONTENT_CSS_SELECTOR) as HTMLElement
            case NodeTargetTypeEnum.BulletAndContent:
                return target as HTMLElement
            case NodeTargetTypeEnum.ExpandedNodeContent:
                return target.closest(BULLET_CONTENT_CSS_SELECTOR) as HTMLElement
            case NodeTargetTypeEnum.PanelContent:
                return target.closest(TANA_DATA_PANEL_CSS_SELECTOR) as HTMLElement
            case NodeTargetTypeEnum.NonTemplateContent:
                return element as HTMLElement
            case NodeTargetTypeEnum.ContentSide:
                return element.closest(BULLET_CONTENT_CSS_SELECTOR) as HTMLElement
            default:
                return null
        }
    }

}