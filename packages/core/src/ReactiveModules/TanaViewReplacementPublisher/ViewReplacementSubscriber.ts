import TanaViewReplacementPublisher from ".";
import { InitEvent } from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import { RegisterNodeViewMessage } from "./types/RegisterNodeViewEvent";
import OnDatabaseInitEvent from 'database-extension/types/OnDatabaseInitEvent';




export default class ViewReplacementSubscriber extends TanaSubscriber<TanaViewReplacementPublisher> {

    getInitRequirements(): InitEvent[] {
        return [
            OnDatabaseInitEvent
        ]
    }
    onDependenciesInitComplete() {
        
    }

    onRegisterNodeView({message}:RuntimeEventInstance<RegisterNodeViewMessage>) {
        const {templateId,config} = message
        this.mediator.getNodeViewStateHandler().addEntry(templateId,config)
    }




}