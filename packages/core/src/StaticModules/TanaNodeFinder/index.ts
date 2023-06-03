import TanaStateProvider from "../../ReactiveModules/TanaStateProvider";
import {Maybe} from "purify-ts";


export default new class TanaNodeFinder {
    public getTemplateNodeWithName(templateName:string) {
        return TanaStateProvider.getAppState()
            .chain(({nodeSpace}) => {
                return Maybe.fromNullable(nodeSpace.templateList.find(node => node.name == templateName))
            })
    }
}