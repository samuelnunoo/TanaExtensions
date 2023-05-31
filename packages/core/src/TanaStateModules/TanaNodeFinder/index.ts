import TanaStateProvider from "../../DataProviders/TanaStateProvider";


export default new class TanaNodeFinder {

    public getTemplateNodeWithName(templateName:string) {
        return TanaStateProvider.getAppState()
            .nodeSpace.templateList.find(node => node.name == templateName)
    }
}