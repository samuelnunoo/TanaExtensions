import TanaExtensionNotifier from "../src/TanaExtensionNotifier/index";
import MockExtension from "./mocks/MockExtension";
import sinon from "sinon"
import IRequest from "../src/types/IRequest";
import test from "ava"

const notifierWith2Mocks = async () => {
    const notifier = new TanaExtensionNotifier()
    const mock = new MockExtension(1)
    const mock2 = new MockExtension(2)
    await notifier.init([mock,mock2])
    return notifier
}

const notifierWithNMocks = async (count:number) => {
    const notifier = new TanaExtensionNotifier()
    const mocks = []
    for (let i = 0 ; i < count; i ++) {
        mocks.push(new MockExtension(i))
    }
    await notifier.init(mocks)
    return notifier
}

const spyOnExtensions = (notifier:TanaExtensionNotifier) => {
    notifier.listeners.forEach(sinon.spy)
}

const mockRequest = () => {
    return {

    } as IRequest
}
test('init: listeners are added to notifier ', async t => {
    const notifier = await notifierWith2Mocks()
    t.deepEqual(notifier.listeners.length,2)
});

test.only("notify: all handlers get invoked", async t => {
    const sandbox = sinon.createSandbox()
    const notifier = await notifierWithNMocks(4)
    const spies = notifier.listeners.map(listener => sandbox.spy(listener))
    const req = {stop:200}
    await notifier.notifyExtensions(req)
    for (const spy of spies) {
        t.deepEqual(spy.handle.calledOnce,true)
    }
    sandbox.restore()
})

test.only("notify: only one handler gets invoked",async t => {
    const sandbox = sinon.createSandbox()
    const notifier = await notifierWithNMocks(3)
    const spies = notifier.listeners.map(listener => sandbox.spy(listener))
    const req = {stop:1} as IRequest
    await notifier.notifyExtensions(req)
    console.log(spies)
    t.deepEqual(spies[0].handle.calledOnce,true)
    t.deepEqual(spies[1].handle.calledOnce,true)
    t.deepEqual(spies[2].handle.calledOnce,false)
    sandbox.restore()
})
