import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import onDomRenderCompleteEvent from "../TanaModuleLoader/types/OnDomRenderCompleteEvent";
import  {NodeEventTypeEnum} from "./types/types";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import TanaStateProvider from "../TanaStateProvider";
import MutationRecordAttributeInspector from "./MutationRecordAttributeInspector";
import NodeHelper from "./NodeHelper";
import {Maybe} from "purify-ts";
import NodeEvent, {NodeEventMessage} from "./types/NodeEvent";

export default class NodeEventPublisher extends TanaPublisher {
    getInitRequirements(): InitEvent[] {
        return [
            onDomRenderCompleteEvent
        ];
    }

    onInitComplete() {
        const originalMutationObserver = MutationObserver
        const {shouldProcessMutationRecord,processMutationRecord} = this
        const classThisArg = this
        //@ts-ignore
        MutationObserver = function(...args) {
            const callback = args[0];
            args[0] = function(mutationsList:MutationRecord[], observer:MutationObserver) {
                for (const mutation of mutationsList) {
                    Maybe.fromFalsy(shouldProcessMutationRecord.bind(classThisArg)(mutation))
                        .chain(_ => processMutationRecord.bind(classThisArg)(mutation))
                }
                return callback.apply(this, arguments);
            }
            //@ts-ignore
            return new originalMutationObserver(...args);
        }
    }

    public invokeNodeEvent(message:NodeEventMessage) {
        const nodeEvent = NodeEvent.createInstance(message)
        this.dispatchRuntimeEvent(nodeEvent)
    }

    private shouldProcessMutationRecord(mutation:MutationRecord) {
        if (mutation.type !== "childList") return false
        if (!MutationRecordAttributeInspector.mutationRecordTargetHasExpectedTagName(mutation.target as HTMLElement)) return false
        if (MutationRecordAttributeInspector.mutationRecordContainsBulletModule(mutation)) return false
        if (!MutationRecordAttributeInspector.mutationRecordTargetHasExpectedClass(mutation)) return false
        return true
    }
    private processMutationRecord(mutation:MutationRecord) {
        const nodeEventType = MutationRecordAttributeInspector.getMutationEventType(mutation)
        const mutatingElement = (nodeEventType == NodeEventTypeEnum.Deletion ? mutation.removedNodes[0] : mutation.addedNodes[0]) as HTMLElement
        const targetType = NodeHelper.getTargetType(mutation.target as HTMLElement)
        if (targetType == null) return
        const nodeElement = NodeHelper.getBlockFromDescendant(mutation.target as HTMLElement,mutatingElement,targetType) as HTMLElement
        if (!nodeElement) return
        const blockId = TanaDomNodeProvider.getIdFromElement(nodeElement)
        if (blockId == null) return
        const panel = TanaDomNodeProvider.getPanelFromNode(nodeElement) as HTMLElement
        if (!panel) return
        const tanaNode = TanaStateProvider.getNodeWithId(blockId)
        if (!tanaNode) return
        const nodeMessage: NodeEventMessage = {
            nodeElement,
            tanaNode:tanaNode.extract()!,
            nodeId:blockId,
            nodeEventType,
            panel,
            isHeaderNode:false
        }
        this.invokeNodeEvent(nodeMessage)
    }



}