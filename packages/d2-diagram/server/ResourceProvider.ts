


export default class ResourceProvider {
    public static contentNodes(): NodeListOf<Element> {
        return document.querySelectorAll(".panelContent > .listItems > .nonTemplateContent .editable")
    }

    public static contentContainer(): Element | null {
        return document.querySelector(".panelContent > .listItems > .nonTemplateContent")
    }
}