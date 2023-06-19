import { Maybe } from "purify-ts";
import TanaConstants from "../TanaDomNodeProvider/TanaConstants";
import {TanaNode} from "../TanaStateProvider/types/types";
import TanaDomNodeProvider from "../TanaDomNodeProvider";

export default new class TanaNodeAttributeInspector extends TanaConstants {

    public getTanaNodeIdFromDomNode(contentNode:HTMLElement) {
        
    }

    public isPanelHeader(node:TanaNode,panel:HTMLElement) {
        const panelHeader = TanaDomNodeProvider.getPanelHeaderFromAncestor(panel)!
        const wrapper = TanaDomNodeProvider.getWrapperNodeFromAncestor(panelHeader!)!
        return wrapper.id == node.id
    }
    public hasTemplateWithName(node:TanaNode,templateName:string) {
        for (const template of node.templates) {
            if (template.name == templateName) return true
        }
        return false
    }
    public hasValidTanaNodeContent(node:HTMLElement) {
        const editableContentSelector = this.classSelector(this.getEditableNodeCssClass())
        if (!this.isValidClassNode(node)) return false
        if (!node.classList.contains(this.getContentNodeCssClass())) return false
        if (! node.querySelector(editableContentSelector)) return false
        return true
    }

    public elementIsDescendantOfPanelHeaderTemplateContainer(element:HTMLElement) {
        return !element.classList.contains(this.getEditableNodeCssClass())
        && !!element.closest(this.classSelector(this.getTanaWrapperCssClass()))
    }

    public isMainPanelContainer(panelContainer:HTMLElement) {
        return Maybe.fromNullable(panelContainer.parentElement)
            .map(dock => dock.getAttribute(this.getDataRoleAttribute()) == this.getMainPanelContainerAttributeValue())
            .orDefault(false)
    }

    public isTopPanelContainer(panelContainer:HTMLElement) {
        return Maybe.fromNullable(panelContainer.parentElement)
            .map(dock => dock.getAttribute(this.getTanaDockAttribute()) == this.getTopDockAttributeValue())
            .orDefault(false)
    }

    public isRightPanelContainer(panelContainer:HTMLElement) {
        return Maybe.fromNullable(panelContainer.parentElement)
            .map(dock => dock.getAttribute(this.getTanaDockAttribute()) == this.getRightDockAttributeValue())
            .orDefault(false)
    }

    public getPanelId(panel:HTMLElement) {
        return  panel.getAttribute(this.getPanelAttribute())
    }

    public isExpandedNode(node:HTMLElement) {
        if (!this.isValidClassNode(node)) return false
        return !!node.querySelector(".contentSide.expanded")
    }

    public hasPanelHeaderAttribute(node:HTMLElement) {
        if (!this.isValidClassNode(node)) return false
        return node.getAttribute(this.getTanaPanelHeaderAttribute()) != null
    }

    public hasDirectTemplateWithName(tanaNode:TanaNode,templateName:string) {
        if (!tanaNode) return false
        if (!tanaNode.templates) return false
        for (const template of tanaNode.templates) {
            if (template.name == templateName) return true
        }
        return false
    }

    public getFirstTemplateWithSuperTag(tanaNode:TanaNode, superTagName:string):TanaNode|null {
        if (!tanaNode || !tanaNode.templates) return null 
        for (const template of tanaNode.templates) {
                if (!template.templates) continue 
                for (const supertag of template.templates) {
                    if (supertag.name == superTagName) return template 
                }
        }
        return null 
    }

    public hasDescendantWithTemplateName(tanaNode:TanaNode,templateName:string) {
        if (!tanaNode || !tanaNode.templates) return false 
        for (const template of tanaNode.templates) {
            if (template.name == templateName) return true 
            if (!template.isSystemNode) return this.hasDescendantWithTemplateName(template,templateName)
        }
        return false 
    }

    private isValidClassNode(node:HTMLElement) {
        if (!node) return false
        if (!('classList' in node)) return false
        return true
    }

}