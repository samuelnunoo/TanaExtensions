import TanaStateProvider from "../TanaStateProvider";
import TanaDomNodeProvider from "../TanaDOMNodeProvider";
import TanaNodeFinder from "../TanaNodeFinder";
import {TANA_CONFIG_TEMPLATE_NAME} from "./types";
import {TanaNode} from "../TanaStateProvider/types/types";
import TanaCommandExecutor from "../TanaCommandExecutor";


export default new class TanaConfigManager {


    private createOrGetConfigNode() {
        const settingsNode = TanaStateProvider.getPrimarySettingsNode()
        const template = TanaNodeFinder.getTemplateNodeWithName(TANA_CONFIG_TEMPLATE_NAME)
        if (!template) this.createConfigNode()
    }


    private createConfigNode(settingsNode:TanaNode) {
       const configNode = settingsNode.insertNewNodeAtEnd
        TanaCommandExecutor.addTemplateToNode(configNode)

    }

    private getConfigNode() {

    }






}