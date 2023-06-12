import TanaViewReplacementPublisher from ".";
import { InitEvent } from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import { RegisterNodeViewMessage } from "./types/RegisterNodeViewEvent";




export default class ViewReplacementSubscriber extends TanaSubscriber<TanaViewReplacementPublisher> {

    getInitRequirements(): InitEvent[] {
        throw new Error("Method not implemented.");
    }
    onDependenciesInitComplete() {
        throw new Error("Method not implemented.");
    }

    onRegisterNodeView({message}:RuntimeEventInstance<RegisterNodeViewMessage>) {
        const {templateId,config} = message
        this.mediator.getNodeViewStateHandler().addEntry(templateId,config)
    }




}