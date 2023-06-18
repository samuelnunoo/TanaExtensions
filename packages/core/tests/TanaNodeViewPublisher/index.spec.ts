/*
@vitest-environment jsdom
 */
import EventBus from '../../src/ReactiveModules/EventBus/index';
import NodeViewReplacementSubscriber from '../../src/ReactiveModules/TanaNodeViewPublisher/NodeViewReplacementSubscriber';
import TanaNodeViewModule from "../../src/ReactiveModules/TanaNodeViewPublisher";
import { Mock } from 'moq.ts';
import RegisterNodeViewEvent, { RegisterNodeViewMessage } from "../../src/ReactiveModules/TanaNodeViewPublisher/types/events/RegisterNodeViewEvent";
import {describe, it, chai, vi, afterEach} from "vitest"
import ReplaceViewEvent, {
    ReplaceViewEventMessage
} from "../../src/ReactiveModules/TanaNodeViewPublisher/types/events/ReplaceViewEvent";
import TanaPubSubModule from "../../src/ReactiveModules/EventBus/types/TanaPubSubModule";


afterEach(() => {
    vi.restoreAllMocks()
})

const invokeAllModuleDependencies = (publisher:TanaPubSubModule,eventBus:EventBus) => {
    publisher.init()
    publisher.getPubSubComponents().forEach(component => {
        component.getInitRequirements().forEach(initRequirement => {
            eventBus.dispatchInitEvent(initRequirement)
        })
    })
}

describe("onDependenciesInitComplete",() => {
    it("is called after dependencies have initialized", async () => {
        const { eventBus,publisher } = data();
        const spy = vi.spyOn(publisher.getNodeViewReplacementSubscriber(),"onDependenciesInitComplete")
        await invokeAllModuleDependencies(publisher,eventBus)
        chai.expect(spy.mock.calls.length).equals(1)
    })
})

describe("OnRegisterNodeView", () => {
    it("can receive RegisterNodeViewEvents", t => {
        const { viewReplacementSub, viewEvent } = data();
        viewReplacementSub.onRegisterNodeView(viewEvent(createRegisterNodeViewMessage().object()))
    })

    it("can register the received nodeEvents to the state handler", async t => {
        const { viewReplacementSub, viewEvent, publisher,eventBus } = data();
        const message = createRegisterNodeViewMessage()
            .setup(instance => instance.templateId)
            .returns("template123")
            .setup(instance => instance.config)
            .returns(defaultConfig())
            .object()

        invokeAllModuleDependencies(publisher,eventBus)
        vi.spyOn(eventBus,"dispatchEventAndAWaitFirstReply").mockReturnValueOnce(Promise.resolve({}))
        await viewReplacementSub.onRegisterNodeView(viewEvent(message))
        chai.expect(viewReplacementSub.mediator.getNodeViewStateHandler().getEntry("template123"))
            .deep.equals(defaultConfig())

    })

    it("will not register duplicate templateId to the state handler", async t => {
        const { viewReplacementSub, viewEvent, publisher,eventBus } = data();

        const message = createRegisterNodeViewMessage()
            .setup(instance => instance.templateId)
            .returns("template123")
            .setup(instance => instance.config)
            .returns(defaultConfig())
            .object()

        const message2 = createRegisterNodeViewMessage()
            .setup(instance => instance.templateId)
            .returns("template123")
            .setup(instance => instance.config)
            .returns({new:"123"})
            .object()

        vi.spyOn(eventBus,"dispatchEventAndAWaitFirstReply").mockReturnValue(Promise.resolve({}))
        await viewReplacementSub.onRegisterNodeView(viewEvent(message))
        await viewReplacementSub.onRegisterNodeView(viewEvent(message2))
        chai.expect(viewReplacementSub.mediator.getNodeViewStateHandler().getEntry("template123")).deep.equals(defaultConfig())
    })

    it("will merge database data to the configuration",  async () => {
        const { viewReplacementSub, viewEvent, eventBus,publisher } = data();
        const message = defaultViewMessage()
        vi.spyOn(eventBus,"dispatchEventAndAWaitFirstReply").mockReturnValueOnce(Promise.resolve({newdata:"data"}))
        await viewReplacementSub.onRegisterNodeView(viewEvent(message))
        chai.expect(viewReplacementSub.mediator.getNodeViewStateHandler().getEntry("template123")).deep.equals({...defaultConfig(),newdata:"data"})
    })

    it("is invoked when a ReplaceViewEvent is dispatched", async () => {
        const { viewReplacementSub, viewEvent, eventBus,publisher } = data();
        const spy2 = vi.spyOn(publisher.getNodeViewReplacementSubscriber(),"onReplaceNodeView")
        await invokeAllModuleDependencies(publisher,eventBus)
        const message = new Mock<ReplaceViewEventMessage>().object()
        const event = ReplaceViewEvent.createInstance(message)
        eventBus.dispatchRuntimeEvent(event)
        chai.expect(spy2.mock.calls.length).equals(1)
    })
})

describe("onReplaceNodeView", () => {
    /*
    This group of tests
     */
})

function data() {
    const eventBus = new EventBus();
    const publisher = new TanaNodeViewModule(eventBus);
    const viewReplacementSub = new NodeViewReplacementSubscriber(publisher, eventBus);
    const viewEvent = (message:RegisterNodeViewMessage) => RegisterNodeViewEvent.createInstance(message);
    return { viewReplacementSub, viewEvent, publisher,eventBus };
}

function createRegisterNodeViewMessage() {
    return  new Mock<RegisterNodeViewMessage>()
}

function defaultConfig() {
    return {config:"123"}
}

function defaultViewMessage() {
    return createRegisterNodeViewMessage()
        .setup(instance => instance.templateId)
        .returns("template123")
        .setup(instance => instance.config)
        .returns(defaultConfig())
        .object();
}
