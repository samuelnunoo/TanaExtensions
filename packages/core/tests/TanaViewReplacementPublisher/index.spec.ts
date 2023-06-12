import EventBus from '../../src/ReactiveModules/EventBus/index';
import ViewReplacementSubscriber from '../../src/ReactiveModules/TanaViewReplacementPublisher/ViewReplacementSubscriber';
import TanaViewReplacementPublisher from "../../src/ReactiveModules/TanaViewReplacementPublisher";
import { Mock } from 'moq.ts';
import RegisterNodeViewEvent, { RegisterNodeViewMessage } from "../../src/ReactiveModules/TanaViewReplacementPublisher/types/RegisterNodeViewEvent";
import test from "ava"

function data() {
    const eventBus = new EventBus();
    const publisher = new TanaViewReplacementPublisher(eventBus);
    const viewReplacementSub = new ViewReplacementSubscriber(publisher, eventBus);
    const viewEvent = (message:RegisterNodeViewMessage) => RegisterNodeViewEvent.createInstance(message);
    return { viewReplacementSub, viewEvent, publisher };
}

function createRegisterNodeViewMessage() {
    return  new Mock<RegisterNodeViewMessage>()
}

function defaultConfig() {
    return {}
}

// -------------------------------------------------------- //
function TestOnRegisterNodeView() {
    test("it can receive RegisterNodeViewEvents", t => {
        const { viewReplacementSub, viewEvent } = data();
        viewReplacementSub.onRegisterNodeView(viewEvent(createRegisterNodeViewMessage().object()))
        t.pass()
    })
    
    test("it can register the received nodeEvents to the state handler", t => {
        const { viewReplacementSub, viewEvent, publisher } = data();
        const message = createRegisterNodeViewMessage()
        .setup(instance => instance.templateId)
        .returns("template123")
        .setup(instance => instance.config)
        .returns(defaultConfig())
        .object()
    
         viewReplacementSub.onRegisterNodeView(viewEvent(message))
         t.deepEqual(viewReplacementSub.mediator.getNodeViewStateHandler().getEntry("template123"),defaultConfig())
    })
    
    test("it will not register duplicate templateId to the state handler", t => {
        const { viewReplacementSub, viewEvent, publisher } = data();
    
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
    
        viewReplacementSub.onRegisterNodeView(viewEvent(message))
        viewReplacementSub.onRegisterNodeView(viewEvent(message2))
        t.deepEqual(viewReplacementSub.mediator.getNodeViewStateHandler().getEntry("template123"),defaultConfig())
    })
}




TestOnRegisterNodeView()


