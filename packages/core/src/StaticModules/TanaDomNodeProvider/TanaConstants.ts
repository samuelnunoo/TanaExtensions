
export default abstract class TanaConstants {

    protected getTanaWrapperCssClass() {
        return "wrapEditableAndMenu"
    }

    protected getPanelHeaderTemplateContainerPrefix() {
        return "PanelHeader-module_templates"
    }

    protected getDataRoleAttribute() {
        return "data-role"
    }

    protected getMainPanelContainerAttributeValue() {
        return "layout-builder"
    }

    protected getDockContainerAttributeSelector() {
        return '[data-role="layout-and-docks"]'
    }

    protected getMainDockAttributeSelector() {
        return 'data-role="layout-builder"'
    }

    protected getBulletModulePrefix() {
        return "Bullet-module"
    }

    protected getContentSideCssClass() {
        return "contentSide"
    }

    protected getPanelContentCssClass() {
        return "panelContent"
    }

    protected getNonTemplateCssClass() {
        return "nonTemplateContent"
    }

    protected getTanaPanelHeaderPrefix() {
        return "PanelHeader-module_templates"
    }

    protected getTanaPanelHeaderAttribute() {
        return "data-is-panel-header"
    }

    protected getTopDockAttributeValue() {
        return "top"
    }

    protected getRightDockAttributeValue() {
        return "right"
    }

    protected getTanaDockAttribute() {
        return "data-dock"
    }


    protected getContentNodeCssClass() {
        return "bulletAndContent"
    }

    protected getEditableNodeCssClass() {
        return "editable"
    }

    protected getPanelAttribute() {
        return "data-panel-id"
    }

    protected getExpandedNodeCssClass() {
        return "expandedNodeContent"
    }

    protected classSelector(classString:string) {
        return `.${classString}`
    }

    protected attributeSelector(attribute:string){
        return `[${attribute}]`
    }

}