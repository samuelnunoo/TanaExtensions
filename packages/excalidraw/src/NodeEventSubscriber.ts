import TanaSubscriber from "tana-extensions-core/src/ReactiveModules/EventBus/types/TanaSubscriber";
import ExcalidrawExtension from ".";
import {InitEvent} from "tana-extensions-core/src/ReactiveModules/EventBus/types/Event";
import RuntimeEventInstance from "tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import TanaDomNodeDecorator from "tana-extensions-core/src/StaticModules/TanaDomNodeDecorator";
import {EXCALIDRAW_TEMPLATE_NAME} from "../types/types";
import TanaNodeAttributeInspector from "tana-extensions-core/src/StaticModules/TanaNodeAttributeInspector";
import OnDatabaseInitEvent from "database-extension/types/OnDatabaseInitEvent";
import ReplaceViewEvent, { ReplaceViewEnum, ReplaceViewEventMessage } from "tana-extensions-core/src/ReactiveModules/TanaViewReplacementPublisher/types/ReplaceViewEvent"


export default class NodeEventSubscriber extends TanaSubscriber<ExcalidrawExtension> {
    getInitRequirements(): InitEvent[] {
        return [
            OnDatabaseInitEvent,
        ]
    }

   replaceElement(nodeEvent: RuntimeEventInstance<ReplaceViewEventMessage>) {
        const {tanaNode,nodeElement,panel} = nodeEvent.message.nodeEvent
        this.mediator.createInstance(tanaNode).then(excalidrawElement => {
            TanaDomNodeDecorator.insertAsView(nodeElement,panel,excalidrawElement)
        })
    }

    handleDeletion(nodeEvent: RuntimeEventInstance<ReplaceViewEventMessage>) {
        const {nodeId} = nodeEvent.message.nodeEvent
        this.mediator.excalidrawInstances.get(nodeId)?.unmount()
        this.mediator.excalidrawInstances.delete(nodeId)
    }

    handleNodeEvent(event:RuntimeEventInstance<ReplaceViewEventMessage>) {
        const {tanaNode} = event.message.nodeEvent
        const {type} = event.message
        if (!TanaNodeAttributeInspector.hasDescendantWithTemplateName(tanaNode,EXCALIDRAW_TEMPLATE_NAME)) return 
        if (type == ReplaceViewEnum.Deletion) this.handleDeletion(event)
        else if (type == ReplaceViewEnum.Insertion) this.replaceElement(event)
    }

    onDependenciesInitComplete() {
        this.subscribeToRuntimeEvent(ReplaceViewEvent,this.handleNodeEvent.bind(this))
    }

}