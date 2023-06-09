

export default abstract class TanaConstants {

    getTanaWrapperCssClass() {
        return "wrapEditableAndMenu"
    }

    getBulletModulePrefix() {
        return "Bullet-module"
    }

    getContentSideCssClass() {
        return "contentSide"
    }

    getPanelContentCssClass() {
        return "panelContent"
    }

    getNonTemplateCssClass() {
        return "nonTemplateContent"
    }

    getTanaPanelHeaderPrefix() {
        return "PanelHeader-module_templates"
    }

    getTanaPanelHeaderAttribute() {
        return "data-is-panel-header"
    }

    getTanaDockAttribute() {
        return "data-dock"
    }

    getContentNodeCssClass() {
        return "bulletAndContent"
    }

    getEditableNodeCssClass() {
        return "editable"
    }

    getPanelAttribute() {
        return "data-panel-id"
    }

    getExpandedNodeCssClass() {
        return "expandedNodeContent"
    }

    classSelector(classString:string) {
        return `.${classString}`
    }

    attributeSelector(attribute:string){
        return `[${attribute}]`
    }


}