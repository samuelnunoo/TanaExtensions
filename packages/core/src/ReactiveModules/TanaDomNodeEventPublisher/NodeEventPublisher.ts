import TanaPublisher from "../EventBus/types/TanaPublisher";
import {InitEvent} from "../EventBus/types/Event";
import onDomRenderCompleteEvent from "../TanaModuleLoader/types/OnDomRenderCompleteEvent";
import {NodeEventTypeEnum} from "./types/types";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import TanaStateProvider from "../../StaticModules/TanaStateProvider";
import MutationRecordAttributeInspector from "../../StaticModules/MutationRecordAttributeInspector";
import NodeHelper from "./NodeHelper";
import {Maybe} from "purify-ts";
import NodeEvent, {NodeElementType, NodeEventMessage} from "./types/NodeEvent";
import TanaDomNodeEventPublisher from './index';

export default class NodeEventPublisher extends TanaPublisher<TanaDomNodeEventPublisher> {
    getInitRequirements(): InitEvent[] {
        return [
            onDomRenderCompleteEvent
        ];
    }

    onDependenciesInitComplete() {
        const originalMutationObserver = MutationObserver
        const {shouldProcessMutationRecord,processMutationRecord} = this
        const classThisArg = this
        //@ts-ignore
        MutationObserver = function(...args) {
            const callback = args[0];
            args[0] = function(mutationsList:MutationRecord[], observer:MutationObserver) {
                for (const mutation of mutationsList) {
                    Maybe.fromFalsy(shouldProcessMutationRecord.bind(classThisArg)(mutation))
                        .extend(_ => processMutationRecord.bind(classThisArg)(mutation))
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

    private getMutatingElement(mutation:MutationRecord,nodeEventType:NodeEventTypeEnum) {
        switch(nodeEventType) {
            case NodeEventTypeEnum.Deletion:
                return mutation.removedNodes[0]
            case NodeEventTypeEnum.Insertion:
                return mutation.addedNodes[0]
            case NodeEventTypeEnum.Update:
                return mutation.removedNodes.length > mutation.addedNodes.length ?
                    mutation.removedNodes[0] : mutation.addedNodes[0]
            case NodeEventTypeEnum.BulletExpand:
                return mutation.addedNodes[0]
            case NodeEventTypeEnum.BulletCollapse:
                return  mutation.removedNodes[0]
            default:
                return null
        }
    }
    private processMutationRecord(mutation:MutationRecord) {
        console.log("Processing Potential NodeEvent", mutation)
        if (!mutation.target) return
        const nodeEventType = MutationRecordAttributeInspector.getMutationEventType(mutation)
        const mutatingElement = this.getMutatingElement(mutation,nodeEventType) as HTMLElement
        if (!mutatingElement) return
        const targetType = NodeHelper.getTargetType(mutation.target as HTMLElement)
        if (targetType == null) return
        const bulletAndContentNodeElement = NodeHelper.getBulletAndContentNodeElementFromDescendant(mutation.target as HTMLElement,mutatingElement,targetType) as HTMLElement
        const wrapAndEditableNodeElement =  NodeHelper.getWrapAndEditableNodeElementFromParent(mutation.target as HTMLElement) as HTMLElement
        if (!bulletAndContentNodeElement && !wrapAndEditableNodeElement) return
        const blockId = TanaDomNodeProvider.getIdFromElement(bulletAndContentNodeElement || wrapAndEditableNodeElement)
        if (blockId == null) return
        const panel = TanaDomNodeProvider.getPanelFromNode(bulletAndContentNodeElement || wrapAndEditableNodeElement) as HTMLElement
        if (!panel) return
        const tanaNode = TanaStateProvider.getNodeWithId(blockId).extract()
        if (!tanaNode) return
        const nodeType = !!bulletAndContentNodeElement ? NodeElementType.BulletAndContent : NodeElementType.WrapEditableAndMenu
        const hasBullet = nodeType == NodeElementType.BulletAndContent
        const nodeElement = hasBullet ? bulletAndContentNodeElement : wrapAndEditableNodeElement
        const nodeMessage: NodeEventMessage = {
            nodeElement,
            tanaNode,
            nodeId:blockId,
            nodeEventType,
            panel,
            isHeaderNode:false,
            nodeType
        }
        this.invokeNodeEvent(nodeMessage)
    }



}