import {PanelEvenTypeEnum} from "../TanaPanelEventModule/types/types";
import TanaConstants from "../../StaticModules/TanaDomNodeProvider/TanaConstants";
import { NodeTargetTypeEnum, NodeEventTypeEnum } from "./types/types";

export default new class NodeHelper extends TanaConstants {

    public  getTargetType(target:HTMLElement) {
        if (!('classList' in target)) return null
        if (target.classList.contains(this.getContentSideCssClass())) return NodeTargetTypeEnum.ContentSide
        if (target.classList.contains(this.getContentNodeCssClass())) return NodeTargetTypeEnum.BulletAndContent
        if (target.classList.contains(this.getEditableNodeCssClass())) return NodeTargetTypeEnum.Editable
        if (target.classList.contains(this.getPanelContentCssClass())) return NodeTargetTypeEnum.PanelContent
        if (target.classList.contains(this.getNonTemplateCssClass())) return NodeTargetTypeEnum.NonTemplateContent
        if (target.classList.contains(this.getExpandedNodeCssClass())) return NodeTargetTypeEnum.ExpandedNodeContent
        return null
    }

    public  getNodeEventType(panelEventType:PanelEvenTypeEnum) {
        return panelEventType == PanelEvenTypeEnum.Deletion
            ? NodeEventTypeEnum.Deletion 
            : panelEventType == PanelEvenTypeEnum.Insertion 
            ? NodeEventTypeEnum.Insertion
            : NodeEventTypeEnum.Update
    }

    public  getWrapAndEditableNodeElementFromParent(element:HTMLElement) {
        const wrapSelector = this.classSelector(this.getTanaWrapperCssClass())
        return element.querySelector(wrapSelector)
    }

    public  getBulletAndContentNodeElementFromDescendant(target:HTMLElement, element:HTMLElement, targetType:NodeTargetTypeEnum) {
        const contentNodeSelector = this.classSelector(this.getContentNodeCssClass())
        const panelSelector = this.attributeSelector(this.getPanelAttribute())

        switch(targetType) {
            case NodeTargetTypeEnum.Editable:
                return target.closest(contentNodeSelector) as HTMLElement
            case NodeTargetTypeEnum.BulletAndContent:
                return target as HTMLElement
            case NodeTargetTypeEnum.ExpandedNodeContent:
                return target.closest(contentNodeSelector) as HTMLElement
            case NodeTargetTypeEnum.PanelContent:
                return target.closest(panelSelector) as HTMLElement
            case NodeTargetTypeEnum.NonTemplateContent:
                return element as HTMLElement
            case NodeTargetTypeEnum.ContentSide:
                return element.closest(contentNodeSelector) as HTMLElement
            default:
                return null
        }
    }

}