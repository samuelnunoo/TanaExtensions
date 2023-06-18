// @vitest-environment jsdom
import {describe, it,chai, vi} from "vitest"
import {
    getFakeNodeView,
    getNodeWithTemplateContent,
    setupFakeTanaDOM
} from "../mocks/DomMocks";
import {TanaNodeViewCreator} from "../../src/StaticModules/TanaNodeViewCreator";
import {TanaNode} from "../../src/StaticModules/TanaStateProvider/types/types";
import {Mock} from "moq.ts";
import NodeViewConfig from "../../src/ReactiveModules/TanaNodeViewPublisher/types/configs/NodeViewConfig";
import {NodeViewType} from "../../src/ReactiveModules/TanaNodeViewPublisher/types/configs/NodeViewType";
import TanaDomNodeProvider from "../../src/StaticModules/TanaDomNodeProvider";
import TanaCommandExecutor from "../../src/StaticModules/TanaCommandExecutor";
import {MouseEvent, Event, HTMLElement} from "happy-dom";

function setup() {
    const {document,window} = setupFakeTanaDOM()
    const nodeElement = getFakeNodeView(document) as Node
    const tanaDOMNode =  getNodeWithTemplateContent(document) as HTMLElement
    const tanaNode = new Mock<TanaNode>().object()
    const nodeViewConfig = new Mock<NodeViewConfig>()
    return {nodeElement, tanaDOMNode, document,window,tanaNode, nodeViewConfig};
}

function getViewContainer(tanaDOMNode:HTMLElement) {
    return tanaDOMNode.querySelector(".node-view-container") as HTMLElement
}

function getNodeViewConfig2(nodeViewConfig: Mock<NodeViewConfig>) {
    return nodeViewConfig
        .setup(instance => instance.defaultConfig.insertBeforeTemplateContent)
        .returns(false)
        .setup(instance => instance.defaultConfig.addBorder)
        .returns(true)
        .setup(instance => instance.defaultConfig.hideHeaderByDefault)
        .returns(false)
        .setup(instance => instance.defaultConfig.addSettingsButton)
        .returns(false)
        .setup(instance => instance.expandedConfig.addSettingsButton)
        .returns(false)
        .setup(instance => instance.defaultConfig.width)
        .returns("100px")
        .setup(instance => instance.expandedConfig.width)
        .returns("50px")
        .setup(instance => instance.defaultConfig.lockByDefault)
        .returns(false)
        .setup(instance => instance.defaultConfig.expandByDefault)
        .returns(false)

}

function setupNodeConfig() {
    return  getNodeViewConfig2(new Mock<NodeViewConfig>())
}

function defaultFixture(config:NodeViewConfig) {
    const {nodeElement, tanaDOMNode,document,window, tanaNode, nodeViewConfig} = setup();
    TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,config,NodeViewType.Default)
    return tanaDOMNode
}

function getInnerNodeView(tanaDOMNode: HTMLElement) {
    return tanaDOMNode.querySelector(".epic-node-view");
}

function getBorder(tanaDOMNode: HTMLElement) {
   return tanaDOMNode.querySelector(".node-view-border") as HTMLElement
}

describe("renderNodeView", () => {

    describe("Default View", () => {

        it("inserts the nodeElement before template content when specified in config",() => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 = getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.insertBeforeTemplateContent)
                .returns(true)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const innerNodeView = tanaDOMNode.querySelector(".node-view-container")
            chai.expect(innerNodeView).not.equal(undefined)
            chai.assert(!!innerNodeView.nextSibling && (innerNodeView.nextSibling as HTMLElement).classList.contains("contentFromTemplate"))
        })

        it("inserts the nodeElement after template content when specified in config",() => {
            const {nodeElement, document,tanaDOMNode, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 = getNodeViewConfig2(nodeViewConfig).object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const innerNodeView = tanaDOMNode.querySelector(".node-view-container")
            chai.expect(innerNodeView).not.equal(undefined)
            chai.assert(!!innerNodeView.nextSibling && (innerNodeView.nextSibling as HTMLElement).classList.contains("nonTemplateContent"))

        })

        it("wraps inserted nodeElement in node-view-container", () => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig).object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const innerNodeView = tanaDOMNode.querySelector(".epic-node-view")
            const parentElement = innerNodeView.parentElement
            chai.assert(parentElement && parentElement.classList.contains("node-view-container"))
        })

        it("adds a border when addBorder is true in config", () => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig).object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const innerNodeView = tanaDOMNode.querySelector(".epic-node-view")
            const parentElement = innerNodeView.parentElement
            chai.assert(parentElement && parentElement.classList.contains("node-view-border"))
        })

        it("does not add a border when addborder is false in config", () => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.addBorder)
                .returns(false)
                .object()

            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const innerNodeView = getInnerNodeView(tanaDOMNode)
            const parentElement = innerNodeView.parentElement
            chai.assert(parentElement && !parentElement.classList.contains("node-view-border"))
        })

        it("hides header text when hideHeaderText is true in config",() => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.hideHeaderByDefault)
                .returns(true)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const header = TanaDomNodeProvider.getContentNodeHeaderFromAncestor(tanaDOMNode)
            chai.assert(header && header.style.display == "none")
        })

        it("does not hide header text when hideHeaderText is false in config", () => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.hideHeaderByDefault)
                .returns(false)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const header = TanaDomNodeProvider.getContentNodeHeaderFromAncestor(tanaDOMNode)
            chai.assert(header && header.style.display != "none")
        })

        it("adds a settings button when showSettings is true in config", () => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.addSettingsButton)
                .returns(true)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const settingsButton = tanaDOMNode.querySelector(".node-view-settings-button")
            chai.assert(settingsButton !== null)
        })

        it("does not add a settings button when addSettingsButton is false in config", ()=> {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.addSettingsButton)
                .returns(false)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const settingsButton = tanaDOMNode.querySelector(".node-view-settings-button")
            chai.assert(settingsButton == null)
        })

        it("sets the height of the nodeElement to the specified value in the config",() => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.height)
                .returns("100px")
                .setup(instance => instance.expandedConfig.height)
                .returns("50px")
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const nodeView = getInnerNodeView(tanaDOMNode) as HTMLElement
            chai.assert(nodeView.style.height == "100px" )
        })

        it("sets the width to the specified value in the config", () => {
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.width)
                .returns("100px")
                .setup(instance => instance.expandedConfig.width)
                .returns("50px")
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            const nodeView = getInnerNodeView(tanaDOMNode) as HTMLElement
            chai.assert(nodeView.style.width == "100px" )
        })

        it("calls the lock method when lockByDefault is true in config",() => {
            const methods = {
                onLock: (nodeView: HTMLElement) => true
            }
            const spy = vi.spyOn(methods,"onLock")

            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.onLock)
                .returns(methods.onLock)
                .setup(instance => instance.defaultConfig.lockByDefault)
                .returns(true)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            chai.assert(spy.mock.calls.length == 1)
        })

        it("does not call the lock method when lockByDefault is false in config",() => {
            const methods = {
                onLock: (nodeView: HTMLElement) => true
            }
            const spy = vi.spyOn(methods,"onLock")

            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.onLock)
                .returns(methods.onLock)
                .setup(instance => instance.defaultConfig.lockByDefault)
                .returns(false)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            chai.assert(spy.mock.calls.length == 0)
        })

        it("expands the associated tana node when expandByDefault is true in config",() => {
            const spy = vi.spyOn(TanaCommandExecutor,"expandTanaNode")
            const {nodeElement, tanaDOMNode,document, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.expandByDefault)
                .returns(true)
                .object()
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            chai.assert(spy.mock.calls.length == 1)
        })

        it("hovering over settings button reveals settings options",() => {
            const {nodeElement, tanaDOMNode,document,window, tanaNode, nodeViewConfig} = setup();
            const methods = {
                onLock: (nodeView:HTMLElement) => true,
                onUnlock: (nodeView:HTMLElement) => true
            }
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.addSettingsButton)
                .returns(true)
                .setup(instance => instance.defaultConfig.onLock)
                .returns(methods.onLock)
                .setup(instance => instance.defaultConfig.onUnlock)
                .returns(methods.onUnlock)
                .object()

            const spy1 = vi.spyOn(methods,"onLock")
            const spy2 = vi.spyOn(methods,"onUnlock")
            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            let mouseOverEvent = new MouseEvent("mouseover",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })
            const settingsButton = tanaDOMNode.querySelector(".node-view-settings-button") as HTMLElement
            settingsButton.dispatchEvent(mouseOverEvent)
            const modal = tanaDOMNode.querySelector(".node-view-settings-modal") as HTMLElement
            chai.assert(modal && modal.style.display == "block")
        })

        it("moving mouse from settings button to settings options does not hide settings options",() => {
            const {nodeElement, tanaDOMNode,document,window, tanaNode, nodeViewConfig} = setup();
            const nodeViewConfig2 =  getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.addSettingsButton)
                .returns(true)
                .object()

            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            let mouseOverEvent1 = new MouseEvent("mouseover",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })

            let mouseOverEvent2 = new MouseEvent("mouseover", {
                view: window,
                'bubbles': true,
                'cancelable': true
            })
            const settingsButton = tanaDOMNode.querySelector(".node-view-settings-button") as HTMLElement
            const modal = tanaDOMNode.querySelector(".node-view-settings-modal") as HTMLElement
            settingsButton.dispatchEvent(mouseOverEvent1)
            modal.dispatchEvent(mouseOverEvent2)
            chai.assert(modal && modal.style.display == "block")
        })

        it("should invoke the bound method when clicking on a lock option",() => {
            const {nodeElement, tanaDOMNode,document,window, tanaNode, nodeViewConfig} = setup();
            const methods = {
                onLock: (nodeView:HTMLElement) => true,
                onUnlock: (nodeView:HTMLElement) => true
            }
            const spy1 = vi.spyOn(methods,"onLock")
            const spy2 = vi.spyOn(methods,"onUnlock")
            const nodeViewConfig2 = getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.addSettingsButton)
                .returns(true)
                .setup(instance => instance.defaultConfig.onLock)
                .returns(methods.onLock)
                .setup(instance => instance.defaultConfig.onUnlock)
                .returns(methods.onUnlock)
                .object()


            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            let mouseOverEvent = new MouseEvent("mouseover",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })

            let clickEvent1 = new MouseEvent("click",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })

            let clickEvent2 = new MouseEvent("click",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })
            const settingsButton = tanaDOMNode.querySelector(".node-view-settings-button") as HTMLElement
            settingsButton.dispatchEvent(mouseOverEvent)

            const modal = tanaDOMNode.querySelector(".node-view-settings-modal") as HTMLElement
            const lockButton = modal.firstChild
            lockButton.dispatchEvent(clickEvent1)
            lockButton.dispatchEvent(clickEvent2)
            chai.assert(spy1.mock.calls.length == 1 && spy2.mock.calls.length == 1)
        })

        it("should switch the button from lock to unlock back to lock when clicking on a lock button twice", () => {
            const {nodeElement, tanaDOMNode,document,window, tanaNode, nodeViewConfig} = setup();
            const methods = {
                onLock: (nodeView:HTMLElement) => true,
                onUnlock: (nodeView:HTMLElement) => true
            }
            const spy1 = vi.spyOn(methods,"onLock")
            const spy2 = vi.spyOn(methods,"onUnlock")
            const nodeViewConfig2 = getNodeViewConfig2(nodeViewConfig)
                .setup(instance => instance.defaultConfig.addSettingsButton)
                .returns(true)
                .setup(instance => instance.defaultConfig.onLock)
                .returns(methods.onLock)
                .setup(instance => instance.defaultConfig.onUnlock)
                .returns(methods.onUnlock)
                .object()


            TanaNodeViewCreator(document).renderNodeView(nodeElement,tanaNode,tanaDOMNode,nodeViewConfig2,NodeViewType.Default)
            let mouseOverEvent = new MouseEvent("mouseover",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })

            let clickEvent1 = new MouseEvent("click",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })

            let clickEvent2 = new MouseEvent("click",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })

            const settingsButton = tanaDOMNode.querySelector(".node-view-settings-button") as HTMLElement
            settingsButton.dispatchEvent(mouseOverEvent)

            const modal = tanaDOMNode.querySelector(".node-view-settings-modal") as HTMLElement
            const lockButton = modal.firstChild as HTMLElement
            lockButton.dispatchEvent(clickEvent1)
            chai.assert(lockButton.innerText === "unlock")
            lockButton.dispatchEvent(clickEvent2)
            chai.assert(lockButton.innerText as string === "lock")
        })

        it("does not show border when mouse is not hovering node view",() => {
            const config = setupNodeConfig().object()
            const tanaDOMNode = defaultFixture(config)
            const border = getBorder(tanaDOMNode);
            chai.assert(border == null)
        })

        it("shows border when mouse is hovering nodeView", () => {
            const config = setupNodeConfig().object()
            const tanaDOMNode = defaultFixture(config)
            const event = new MouseEvent("mouseover",{
                view: window,
                'bubbles': true,
                'cancelable': true
            })
            const viewContainer = getViewContainer(tanaDOMNode)
            viewContainer.dispatchEvent(event)
            const border = getBorder(tanaDOMNode)
            chai.assert(!!border)
        })

        it("renders specified tana nodes in NodeView Config node",() => {

        })

        it.todo("rendered nodes in NodeView config are not visible")

        it.todo("rendered nodes in NodeView Config do not take up space on the DOM")
    })

    describe("Expanded View", () => {
        it.todo("adds a border when addBorder is true in config")
        it.todo("hides header text when hideHeaderText is true in config")
        it.todo("adds a settings button when showSettings is true in config")
        it.todo("sets the height to the specified value in the config")
        it.todo("sets the width to the specified value in the config")
        it.todo("it calls the lock method when lockByDefault is true in config")
        it.todo("it expands the associated tana node when expandByDefault is true in config")
        it.todo("hovering over settings button reveals settings options")
        it.todo("moving mouse from settings button to settings options does not hide settings options")
        it.todo("clicking on a settings option invokes the bounded method and closes the modal")
        it.todo("border is not visible when mouse is not hovering node view")
        it.todo("border becomes visible when mouse is hovering node view")
        it.todo("removes side padding when that option is specified in config")
        it.todo("renders specified tana nodes in NodeView Config node")
        it.todo("rendered nodes in nodeview config are not visible")
        it.todo("rendered nodes in NodeView Config do not take up space on the DOM")
    })

    describe("Fullscreen View", () => {
        it.todo("has width which takes up 100% of screen width")
        it.todo("has height which takes up 100% of screen height")
        it.todo("closes fullscreen when the exit key is pressed")
        it.todo("renders specified tana nodes in NodeView Config node")
        it.todo("rendered nodes in nodeview config are not visible")
        it.todo("rendered nodes in NodeView Config do not take up space on the DOM")
    })
})

