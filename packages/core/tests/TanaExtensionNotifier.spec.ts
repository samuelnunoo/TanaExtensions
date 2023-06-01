import TanaExtensionNotifier from "../src/TanaExtensionNotifier/index";
import MockExtension from "./mocks/MockExtension";
import sinon from "sinon"
import IRequest from "../src/types/IRequest";
import test from "ava"

const notifierWith2Mocks = async () => {
    const notifier = new TanaExtensionNotifier()
    const mock = new MockExtension()
    const mock2 = new MockExtension()
    await notifier.init([mock,mock2])
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

test("notify: all handlers get invoked", async t => {
    const sandbox = sinon.createSandbox() // console.log(sandbox)
    const notifier = await notifierWith2Mocks()
    const mock1 = sandbox.spy(notifier.listeners[0])
    const mock2 = sandbox.spy(notifier.listeners[1])
    await notifier.notifyExtensions(mockRequest())
    t.deepEqual(mock1.handle.calledOnce,true)
    t.deepEqual(mock2.handle.calledOnce,true)
    sandbox.restore()
})
