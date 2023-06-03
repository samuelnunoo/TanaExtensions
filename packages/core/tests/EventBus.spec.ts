import test from "ava"
import EventBus from "../src/ReactiveModules/EventBus";
import {BaseEvent, InitEventCallback, EventType} from "../src/ReactiveModules/EventBus/types/Event";
import sinon from "sinon";


const mockCallback = () => {
    return () => {
        console.log('ok')
    }
}



function extracted() {
    const event: BaseEvent = {type: EventType.RuntimeEvent, identifier: "ok"}
    return event;
}

function method() {
    const eventBus = new EventBus()
    const event = extracted();
    const callback: InitEventCallback = mockCallback()
    return {eventBus, event, callback};
}



function dispatchEvent() {
    const sandbox = sinon.createSandbox()
    const {eventBus, event, callback} = method()
    const spy = sandbox.spy(callback)
    eventBus.subscribe(event, spy)
    eventBus.dispatch(event)
    return {
        spy, eventBus,event,callback
    }
}
test("can subscribe to event", t => {
    const {eventBus, event, callback} = method();
    eventBus.subscribe(event,callback)
    t.deepEqual(eventBus.subscribers.get(event.identifier)?.length,1)
})


test.only("can invoke listeners to event", t => {
    const data = dispatchEvent();
    t.deepEqual(data.spy.calledOnce,true)
})

test.only("can unsubscribe hooks", t => {
   const data = dispatchEvent()
    data.eventBus.unsubscribe(data.event,data.spy)
    t.deepEqual(data.eventBus.subscribers.get(data.event.identifier)?.length,0)
})