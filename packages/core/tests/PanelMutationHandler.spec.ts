import test from "ava"
import TanaDomPanelEventPublisher from "../src/ReactiveModules/TanaDomPanelEventPublisher";
import EventBus from "../src/ReactiveModules/EventBus";
import PanelMutationHandler from "../src/ReactiveModules/TanaDomPanelEventPublisher/PanelMutationHandler";

import RuntimeEventInstance from "../src/ReactiveModules/EventBus/types/RuntimeEventInstance";
import {PanelEventMessage} from "../src/ReactiveModules/TanaDomPanelEventPublisher/types/PanelEvent";
import {Mock} from "moq.ts";
import {createJSDOM, toNodeList} from "./mocks/DomUtilities";
import {panelWithAncestors, templateContainer} from "./mocks/DomMocks";
import Sinon, {SinonSpiedInstance} from "sinon";

const {document} =  createJSDOM()

function createMutationHandler() {
    const sandbox = Sinon.createSandbox()
    const eventBus = new EventBus()
    const spyBus = sandbox.spy(eventBus)

    const publisher = new TanaDomPanelEventPublisher(eventBus)
    const mutationHandler = new PanelMutationHandler(publisher)
    return {spyBus,mutationHandler};
}


function panelHeaderChangeMutationHandler() {
    /*
        This method is responsible for observing
        changes to the panel header. Changes to the Panel Header
        described in the mutation record can be used to extract the
        panel, panelContainer, and also the new panel id.

     */

    const createPanelHeaderMutationRecord = () => {
        return new Mock<MutationRecord>()
            .setup(instance => instance.target)
            .returns(templateContainer(document)
            .setup(instance => instance.target)
            .returns(panelWithAncestors(document))
            .setup(instance => instance.removedNodes)
            .returns(toNodeList(document,[]))
    }

    const panelHeaderChangeMutationMacro = test.macro((t,spyBus:SinonSpiedInstance<EventBus>,expectedCalls:RuntimeEventInstance<PanelEventMessage>[]) => {
        t.is(spyBus.dispatchRuntimeEvent.getCalls() as RuntimeEventInstance<PanelEventMessage>[],expectedCalls)
    })

    test.only("resultant panel event has the correct panel on panel header change ", panelHeaderChangeMutationMacro,
        (() => {
        const {spyBus, mutationHandler} = createMutationHandler()
        const mutationRecord = createPanelHeaderMutationRecord().object()
        mutationHandler.panelHeaderChangeMutationHandler([mutationRecord])
        return spyBus

    })(),true)
    test.todo("resultant panel event has the correct panelContainer on panel header change")
    test.todo("resultant panel event has the correct panel id on panel header change ")
    test.todo("resultant panel event has the deletion type on panel header removal")
    test.todo("resultant panel event the insertion type on panel header added")
    test.todo("no panel event is invoked when mutation does not contain a panel or panel container")
}


function handleDockContainerChildListMutationEvent() {
    /*
        This method is responsible for observing changes to the panel container.
        The panel container is the child of a dock (main-dock, right-dock, top-dock) that
        directly contains the panels. Changes to the panel container's child list should be
        processed by this handler.
     */

    test.todo("dispatches a panel event upon container mutation")
    test.todo("dispatched container mutation has correct panel")
    test.todo("dispatched container mutation has correct panel id")
    test.todo("dispatched container mutation has correct container")
    test.todo("dispatched container panel removed mutation has correct event type")
    test.todo("dispatched container panel added mutation has correct event type")

}

function handleDockContainerChildListMutationEvent2() {

    /*
    This method is responsible for observing changes to the dock container.
    The dock container is the div element that directly contains all of the docks
    (main-dock, top-dock, right-dock). Changes to the child list of the dock container should
    be processed by this handler.
     */

    test.todo("dispatches a panel event when the right dock is added")
    test.todo("dispatches a panel event when the top dock is added")
    test.todo("dispatched panel event invokes all of the panels in the right dock")
    test.todo("dispatched panel event invokes all of the panels in the top dock")
}


function handleMainDockChildListMutationEvent() {

    /*
    This method is responsible for observing changes to the main dock container.
    This is the default tana panel that you see. Whenver the user switches pages the
    captured mutation should be processed by this method
     */

    test.todo("dispatches a correct panel event when the page is changed by clicking bullet")
    test.todo("dispatches a correct panel event when the page is changed by click the side panel")
}


panelHeaderChangeMutationHandler()