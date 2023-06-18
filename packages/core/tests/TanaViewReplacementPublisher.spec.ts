import test from "ava"
import TanaNodeReplacementPublisher from '../src/ReactiveModules/TanaNodeViewPublisher/index';
import EventBus from "../src/ReactiveModules/EventBus";
import RuntimeEventInstance from "../src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import {NodeEventMessage} from "../src/ReactiveModules/TanaDomNodeEventPublisher/types/NodeEvent";
import {TanaNode} from "../src/StaticModules/TanaStateProvider/types/types";
import {NodeEventTypeEnum} from "../src/ReactiveModules/TanaDomNodeEventPublisher/types/types";
import {expandedBlockContent} from "./mocks/DomMocks";
import {Mock} from "moq.ts"
import {JSDOM} from "jsdom"
import ReplaceViewEvent, {
    ReplaceViewEnum,
    ReplaceViewEventMessage
} from "../src/ReactiveModules/TanaNodeViewPublisher/types/events/ReplaceViewEvent";
import {createSandbox} from "sinon";
const  {document} = (new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)).window;

function createMediator() {
    const bus = new EventBus()
    const mediator = new TanaNodeReplacementPublisher(bus)
    mediator.replacedNodeIds.add("replacedNodeId")
    mediator.deletedNodeIds.add("deletedNodeId")
    return mediator;
}

function createMediatorAndBus() {
    const bus = new EventBus()
    const mediator = new TanaNodeReplacementPublisher(bus)
    mediator.replacedNodeIds.add("replacedNodeId")
    mediator.deletedNodeIds.add("deletedNodeId")
    return {bus,mediator}
}

const template = new Mock<TanaNode>()
    .setup(instance => instance.name)
    .returns("view-extension")
    .object()

const meetsViewDeletionCriteriaMacro = test.macro((t, event: RuntimeEventInstance<NodeEventMessage>, expected: boolean) => {
    const mediator = createMediator()
    t.is(mediator.getNodeEventSubscriber().meetsViewDeletionCritiera(event), expected)
})

const meetsViewInsertionCriteriaMacro = test.macro((t,event:RuntimeEventInstance<NodeEventMessage>,expected:boolean) => {
    const mediator = createMediator();
    t.is(mediator.getNodeEventSubscriber().meetsViewInsertionCriteria(event), expected)
})

const createNodeEventMeetingDeletionCritiera = () => {
    return new Mock<RuntimeEventInstance<NodeEventMessage>>()
        .setup(instance => instance.message.tanaNode.templates)
        .returns([template])
        .setup(instance => instance.message.nodeEventType)
        .returns(NodeEventTypeEnum.Deletion)
        .setup(instance => instance.message.nodeId)
        .returns("replacedNodeId")
        .setup(instance => instance.getIdentifier())
        .returns("nodeEvent")
}

const createNodeEventMeetingInsertingCritiera = () => {
    return new Mock<RuntimeEventInstance<NodeEventMessage>>()
        .setup(instance => instance.message.nodeEventType)
        .returns(NodeEventTypeEnum.Insertion)
        .setup(instance => instance.message.tanaNode.templates)
        .returns([template])
        .setup(instance => instance.message.nodeElement)
        .returns(expandedBlockContent(document))
        .setup(instance => instance.message.isHeaderNode)
        .returns(false)
        .setup(instance => instance.getIdentifier())
        .returns("nodeEvent")
        .setup(instance => instance.message.nodeId)
        .returns("nodeId1")
}
function MeetsViewInsertionCriteria() {
    test("returns false when nodeEvent is not Insertion or BulletExpand",meetsViewInsertionCriteriaMacro,(() => {
        return createNodeEventMeetingInsertingCritiera()
            .setup(instance => instance.message.nodeEventType)
            .returns(NodeEventTypeEnum.Deletion)
            .object()
    })(),false)

    test("returns false when nodeId exists in the replacedNodeId set", meetsViewInsertionCriteriaMacro,(() => {
        return createNodeEventMeetingInsertingCritiera()
            .setup(instance => instance.message.nodeId)
            .returns("replacedNodeId")
            .object()
    })(),false)

    test("returns false if the element is not a header node or expandedNode", meetsViewInsertionCriteriaMacro,(() => {
        return createNodeEventMeetingInsertingCritiera()
            .setup(instance => instance.message.nodeElement)
            .returns(document.createElement("div"))
            .object()
    })(),false)

    test("returns false if the tanaNode does not contain view-container as a template",meetsViewInsertionCriteriaMacro,(() => {
        return createNodeEventMeetingInsertingCritiera()
            .setup(instance => instance.message.tanaNode.templates)
            .returns([])
            .object()
    })(),false)

    test("returns true if all values are correct",meetsViewInsertionCriteriaMacro,(() => {
        return createNodeEventMeetingInsertingCritiera()
            .object()
    })(),true)

}
function MeetsViewDeletionCriteria() {
    test("meetsViewDeletionCritiera: returns false when tanaNode does not have view-extension tag", meetsViewDeletionCriteriaMacro, (() => {
        return createNodeEventMeetingDeletionCritiera()
            .setup(instance => instance.message.tanaNode.templates)
            .returns([])
            .object()
    })(), false)

    test("meetsViewDeletionCritiera: return false if nodeEventType is not deletion or bulletCollapse", meetsViewDeletionCriteriaMacro, (() => {
        return createNodeEventMeetingDeletionCritiera()
            .setup(instance => instance.message.nodeEventType)
            .returns(NodeEventTypeEnum.Insertion)
            .object()
    })(), false)

    test("meetsViewDeletionCritiera: returns false if it not in insertion set", meetsViewDeletionCriteriaMacro, (() => {
        return createNodeEventMeetingDeletionCritiera()
            .setup(instance => instance.message.nodeId)
            .returns("NOT")
            .object()
    })(), false)

    test("meetsViewDeletionCritiera: returns true if all conditions are valid", meetsViewDeletionCriteriaMacro, (() => {
        return createNodeEventMeetingDeletionCritiera().object()
    })(), true)
}
function handleNodeEvent(events:RuntimeEventInstance<NodeEventMessage>[]) {
    const sandbox = createSandbox()
    const {mediator, bus} = createMediatorAndBus()
    const busSpy = sandbox.spy(bus)
    events.forEach(event => {
        mediator.getNodeEventSubscriber().handleNodeEvent(event)
    })
    return {busSpy}
}

function HandleNodeEvent() {
    test("handleNodeEvent: insertViewEvent is dispatched when provided valid insertionCriteria", t => {
        const event = createNodeEventMeetingInsertingCritiera().object()
        const {busSpy} = handleNodeEvent([event]);
        t.is(busSpy.dispatchRuntimeEvent.calledOnce,true)
    })

    test("handleNodeEvent: insertViewEvent is only dispatched once for an identical nodeId", t=> {
        const event = createNodeEventMeetingInsertingCritiera().object()
        const {busSpy} = handleNodeEvent([event,event]);
        t.is(busSpy.dispatchRuntimeEvent.calledOnce,true)
    })

    test("handleNodeEvent: insertViewEVent is dispatched multiple times for a different nodeId", t=> {
        const event1 = createNodeEventMeetingInsertingCritiera().object()
        const event2 = createNodeEventMeetingInsertingCritiera()
            .setup(instance => instance.message.nodeId)
            .returns("nodeId2")
            .object()
        const {busSpy} = handleNodeEvent([event1,event2]);
        t.is(busSpy.dispatchRuntimeEvent.callCount,2)
    })

    test("HandleNodeEvent: removeViewEvent is dispatched when provided valid deletionCritiera",t => {
        const event = createNodeEventMeetingDeletionCritiera().object()
        const {busSpy} = handleNodeEvent([event])
        t.is(busSpy.dispatchRuntimeEvent.calledOnce,true)
    })

    test("HanldNodeEvent: removeViewEvent is not dispatched when there isn't a valid replaced nodeId", t => {
        const event = createNodeEventMeetingDeletionCritiera()
            .setup(instance => instance.message.nodeId)
            .returns("notReplaced")
            .object()
        const {busSpy} = handleNodeEvent([event])
        t.is(busSpy.dispatchRuntimeEvent.calledOnce,false)
    })

    test("HandleNodeEvent: removeViewEvent is only dispatched once when the same event is invoked twice", t=> {
        const  event = createNodeEventMeetingDeletionCritiera().object()
        const {busSpy} = handleNodeEvent([event,event])
        t.is(busSpy.dispatchRuntimeEvent.calledOnce,true)
    })

    test("HandleNodeEvent: after being inserted then replaced, the same nodeId can then be inserted and deleted again", t=> {
        const insertion = createNodeEventMeetingInsertingCritiera()
            .setup(instance => instance.message.nodeId)
            .returns("nodeId100")
            .object()
        const deletion = createNodeEventMeetingDeletionCritiera()
            .setup(instance => instance.message.nodeId)
            .returns("nodeId100")
            .object()

        const {busSpy} = handleNodeEvent([insertion,deletion,insertion,deletion])
        t.is(busSpy.dispatchRuntimeEvent.callCount,4)
    })

    test("HandleNodeEvent: no event is dispatched when provided invalid criteria", t => {
        const deletion = createNodeEventMeetingDeletionCritiera()
            .setup(instance => instance.message.nodeId)
            .returns("notReplacedId")
            .object()
        const {busSpy} = handleNodeEvent([deletion])
        t.is(busSpy.dispatchRuntimeEvent.callCount,0)
    })

    test("HandleNodeEvent: it dispatches a ReplaceViewEvent with the proper type for insertion", t => {
        const insertion = createNodeEventMeetingInsertingCritiera().object()
        const {busSpy} = handleNodeEvent([insertion])
        busSpy.dispatchRuntimeEvent.getCalls().forEach(call => {
            t.is((call.firstArg as RuntimeEventInstance<ReplaceViewEventMessage>).getIdentifier(),ReplaceViewEvent.getIdentifier())
            t.is((call.firstArg as RuntimeEventInstance<ReplaceViewEventMessage>).message.type, ReplaceViewEnum.Insertion)
        })
    })

    test("HandleNodeEvent: it dispatches a ReplaceViewEvent with the proper type for deletion", t => {
        const deletion = createNodeEventMeetingDeletionCritiera().object()
        const {busSpy} = handleNodeEvent([deletion])
        busSpy.dispatchRuntimeEvent.getCalls().forEach(call => {
            t.is((call.firstArg as RuntimeEventInstance<ReplaceViewEventMessage>).getIdentifier(),ReplaceViewEvent.getIdentifier())
            t.is((call.firstArg as RuntimeEventInstance<ReplaceViewEventMessage>).message.type, ReplaceViewEnum.Deletion)
        })
    })
}

const TestMethods = [
    MeetsViewDeletionCriteria(),
    MeetsViewInsertionCriteria(),
    HandleNodeEvent()
]


