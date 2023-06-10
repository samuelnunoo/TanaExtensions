

export default abstract class TanaConstants {

    protected getTanaWrapperCssClass() {
        return "wrapEditableAndMenu"
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