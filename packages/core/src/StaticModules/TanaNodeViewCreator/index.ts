import NodeViewConfig from "../../ReactiveModules/TanaNodeViewPublisher/types/configs/NodeViewConfig";
import {curry, Maybe} from "purify-ts";
import TanaDomNodeProvider from "../TanaDomNodeProvider";
import {NodeViewType} from "../../ReactiveModules/TanaNodeViewPublisher/types/configs/NodeViewType";
import {TanaNode} from "../TanaStateProvider/types/types";
import TanaCommandExecutor from "../TanaCommandExecutor";
import autoBind from "auto-bind";
import { magma } from 'fp-ts';
import RuntimeEventInstance from "../../ReactiveModules/EventBus/types/RuntimeEventInstance";
import { ReplaceViewEventMessage } from "../../ReactiveModules/TanaNodeViewPublisher/types/events/ReplaceViewEvent";
import { head } from "fp-ts/lib/ReadonlyNonEmptyArray";

const NODE_VIEW_CONTAINER_CLASS = "node-view-container"
const NODE_VIEW_BORDER_CLASS = "node-view-border"
const NODE_VIEW_SETTINGS_MODAL_CLASS = "node-view-settings-modal"
const NODE_VIEW_SETTINGS_SELECTOR = `.${NODE_VIEW_SETTINGS_MODAL_CLASS}`
const MODAL_BUTTON = "modal-button"
const SETTINGS_BUTTON = "node-view-settings-button"

class _TanaNodeViewCreator {
    doc:Document
    constructor(doc:Document) {
        this.doc = doc
        autoBind(this)
    }

    public renderNodeView(
        event:RuntimeEventInstance<ReplaceViewEventMessage>,
        config:NodeViewConfig<any>,
        nodeView:HTMLDivElement
    ) {
        const {nodeElement,isHeaderNode,panel} = event.message.nodeEvent 
        const viewContainer = this.wrapInViewContainer(event,config,nodeView)
        const listItemAncestor = isHeaderNode ? panel :nodeElement
        Maybe.fromNullable(TanaDomNodeProvider.getListItemContainerFromAncestor(listItemAncestor))
            .map(listItemContainer => {
                const prependNonTemplateContent = !config.defaultConfig().insertBeforeTemplateContent &&
                    listItemContainer.childNodes.length > 1
                const nodeToPrepend = prependNonTemplateContent ?
                    listItemContainer.childNodes[1] : listItemContainer.childNodes[0]
                listItemContainer.insertBefore(viewContainer,nodeToPrepend!)
            })
    }


    private removePadding() {
        
    }
    private wrapInViewContainer(event:RuntimeEventInstance<ReplaceViewEventMessage>, config:NodeViewConfig<any>,nodeView:HTMLDivElement) {
        const {nodeViewType,tanaNode} = event.message.nodeEvent
        const viewContainer = this.createViewContainer()
        viewContainer.appendChild(nodeView)
        this.preventEventPropagationInContainer(viewContainer)
        this.addBorder(viewContainer,config,nodeViewType)
        this.hideHeader(event,config,nodeViewType)
        this.configureDimension(nodeView,config,nodeViewType)
        this.setupLock(nodeView,config,nodeViewType)
        this.setupSettingsModal(viewContainer,config,nodeViewType)
        this.expandNode(tanaNode,config,nodeViewType)
        return viewContainer
    }

    private preventEventPropagationInContainer(viewContainer:HTMLElement) {
        const events = ["mousedown","click","pointerdown"]
        events.forEach(event => {
            viewContainer.addEventListener(event, (e) => {
                e.stopPropagation()
            })
        })

        viewContainer.addEventListener("focus",(e) => {
            if (!(e.target as HTMLElement).closest(NODE_VIEW_CONTAINER_CLASS)) {
                e.preventDefault()
            }
        })
    }

    private addBorder(viewContainer:HTMLDivElement,config:NodeViewConfig<any>,nodeViewType: NodeViewType) {
        const shouldAddBorder =
            config.defaultConfig().addBorder && nodeViewType == NodeViewType.Default ||
            config.expandedConfig().addBorder && nodeViewType == NodeViewType.Expanded

        if (!shouldAddBorder) return
        viewContainer.addEventListener("mouseover", (event) => {
            const container = event.target as HTMLElement
            container.classList.add(NODE_VIEW_BORDER_CLASS)
        })

        viewContainer.addEventListener("mouseleave", (event) => {
            const container = event.target as HTMLElement
            container.classList.remove(NODE_VIEW_BORDER_CLASS)
        })
    }

    private hideElement(element:HTMLElement) {
        element.style.display = "none"
       // element.style.visibility = "hidden"
       // element.style.position = "absolute"
    }

    private hideHeader(event:RuntimeEventInstance<ReplaceViewEventMessage>,config:NodeViewConfig<any>, nodeViewType: NodeViewType) {
        const shouldHideHeader = (nodeViewType == NodeViewType.Default && config.defaultConfig().hideHeaderByDefault) ||
            (nodeViewType == NodeViewType.Expanded && config.expandedConfig().hideHeader)
        if (!shouldHideHeader) return
        const {isHeaderNode,nodeElement,panel} = event.message.nodeEvent

        if (isHeaderNode) {
                Maybe.fromNullable(TanaDomNodeProvider.getPanelHeaderFromAncestor(panel))
                    .map(panelHeader => this.hideElement(panelHeader))
        }
        else {
            Maybe.fromNullable(TanaDomNodeProvider.getContentNodeHeaderFromAncestor(nodeElement))
            .map(headerNode => this.hideElement(headerNode))
        }
    }

    private createViewContainer() {
        const viewContainer = this.doc.createElement("div")
        viewContainer.classList.add(NODE_VIEW_CONTAINER_CLASS)
        return viewContainer
    }

    private createSettingsButton() {
        const button = this.doc.createElement("button")
        button.classList.add(SETTINGS_BUTTON)
        button.addEventListener("mouseover",(event) => {
            this.showModal(event.target as HTMLElement)
        })
        return button
    }

    private createSettingsOptionButton(text:string,color:string,onClickFunction:(event:Event) => unknown) {
        const button = this.doc.createElement("button")
        button.classList.add(MODAL_BUTTON)
        button.innerText = text
        button.style.background = color
        button.addEventListener("click",(event) => {
            onClickFunction(event)
            this.hideModal(event.target as HTMLElement)
        })
        return button
    }

    private getModal(modalDescendant: HTMLElement) {
        return modalDescendant.closest(NODE_VIEW_SETTINGS_SELECTOR) as HTMLElement
    }

    private showModal(modalDescendant:HTMLElement) {
        Maybe.fromNullable(this.getModal(modalDescendant))
            .map(modal => { modal.style.visibility = "visible" })
    }

    private hideModal(modalDescendant:HTMLElement) {
        Maybe.fromNullable(this.getModal(modalDescendant))
            .map(modal => { modal.style.visibility = "hidden" })
    }

    private createSettingsModal() {
        const container = this.doc.createElement("div")
        container.classList.add(NODE_VIEW_SETTINGS_MODAL_CLASS)
        return container
    }

    private invokeFullscreen(event:Event) {

    }

    private addFullscreenButton(modalContainer:HTMLElement,config:NodeViewConfig<any>,nodeViewType:NodeViewType) {
        if (nodeViewType == NodeViewType.Fullscreen) return
        const shouldAddButton =
            nodeViewType == NodeViewType.Default && config.defaultConfig().allowFullscreen
            || nodeViewType == NodeViewType.Expanded && config.expandedConfig().allowFullscreen

        if (shouldAddButton) {
            this.createSettingsOptionButton("Fullscreen","green",this.invokeFullscreen)
        }
    }

    private getNodeView(descendant:HTMLElement) {
        return descendant.closest(".node-view-container")
    }

    private lockToggle(onLock: (nodeView:HTMLElement) => unknown, onUnlock: (nodeView:HTMLElement) => unknown) {
        let shouldLock = true
        return (event:Event) => {
            const lockButton = event.target as HTMLElement
            const nodeView = this.getNodeView(lockButton) as HTMLElement
            if (shouldLock) {
                lockButton.innerText = "unlock"
                onLock(nodeView)
            }
            else  {
                lockButton.innerText = "lock"
                onUnlock(nodeView)
            }

            shouldLock = !shouldLock
        }
    }

    private addLockButton(modalContainer:HTMLDivElement,config:NodeViewConfig<any>,nodeViewType:NodeViewType) {
        const settingsButton = curry(this.createSettingsOptionButton)("lock")("purple").bind(this)
        let onLockFunction:((nodeView:HTMLElement) => unknown)| undefined
        let onUnlockFunction:((nodeView:HTMLElement) => unknown)|undefined
        switch(nodeViewType) {
            case NodeViewType.Default:
                onLockFunction = config.defaultConfig().onLock
                onUnlockFunction = config.defaultConfig().onUnlock
                break;
            case NodeViewType.Expanded:
                onLockFunction = config.expandedConfig().onLock
                onUnlockFunction = config.expandedConfig().onUnlock
                break;
            default:
                break;
        }

        Maybe.fromFalsy(!!onLockFunction && !!onUnlockFunction)
            .map(_ => {
                const button = settingsButton(this.lockToggle(onLockFunction!, onUnlockFunction!))
                modalContainer.appendChild(button)
            })
    }

    private createOptionsContainer() {
        const container = this.doc.createElement("div")
        container.classList.add("modal-options-container")
        return container 
    }
    private setupSettingsModal(viewContainer:HTMLElement,config:NodeViewConfig<any>,nodeViewType: NodeViewType) {
        const shouldAddSettingsButton =
            config.defaultConfig().addSettingsButton && nodeViewType == NodeViewType.Default ||
            config.expandedConfig().addSettingsButton && nodeViewType == NodeViewType.Expanded
        if (!shouldAddSettingsButton) return

        const modalContainer  = this.createSettingsModal()
        const optionsContainer = this.createOptionsContainer()
        const settingsButton = this.createSettingsButton()

        this.addFullscreenButton(optionsContainer,config,nodeViewType)
        this.addLockButton(optionsContainer,config,nodeViewType)

        modalContainer.appendChild(optionsContainer)
        modalContainer.appendChild(settingsButton)
        viewContainer.appendChild(modalContainer)

        modalContainer.addEventListener("mouseleave",(event) => {
            const container = event.target as HTMLElement
            container.style.visibility = "hidden"
        })

        viewContainer.addEventListener("mouseover",(event) => {
            this.showSettingsButton(viewContainer)
        })

        viewContainer.addEventListener("mouseleave", (event) => {
            this.hideSettingsButton(viewContainer)
        })
    }

    private addSettingsButton(viewContainer:HTMLDivElement,config:NodeViewConfig<any>,nodeViewType:NodeViewType) {
        const shouldAddSettingsButton =
            config.defaultConfig().addSettingsButton && nodeViewType == NodeViewType.Default ||
            config.expandedConfig().addSettingsButton && nodeViewType == NodeViewType.Expanded
        if (!shouldAddSettingsButton) return
        const settingsButton = this.createSettingsButton()
        settingsButton.addEventListener("mouseover",(event) => {
            const button = event.target as HTMLElement
            button.style.display = "block"
        })
        viewContainer.appendChild(settingsButton)
    }

    private getSettingButtonFromAncestor(ancestor:HTMLElement) {
        return ancestor.querySelector(".node-view-settings-button") as HTMLElement
    }
    private showSettingsButton(viewContainer:HTMLElement) {
        const settingsButton =  this.getSettingButtonFromAncestor(viewContainer)
        settingsButton.style.visibility = "visible"
    }

    private hideSettingsButton(viewContainer:HTMLElement) {
        const settingsButton = this.getSettingButtonFromAncestor(viewContainer)
        settingsButton.style.visibility = "hidden"
    }

    private configureDimension(nodeView: HTMLElement, config:NodeViewConfig<any>, nodeViewType:NodeViewType) {
        if (nodeViewType == NodeViewType.Fullscreen) return
        const height = nodeViewType == NodeViewType.Default ? config.defaultConfig().height : config.expandedConfig().height
        const width = nodeViewType == NodeViewType.Default ? config.defaultConfig().width : config.expandedConfig().width
        config.setDimensions(nodeView,width,height)
    }

    private setupLock(nodeView:HTMLElement,config:NodeViewConfig<any>,nodeViewType: NodeViewType) {
        const onLock =
            nodeViewType == NodeViewType.Default && config.defaultConfig().lockByDefault
            ? config.defaultConfig().onLock
            : nodeViewType == NodeViewType.Expanded && config.expandedConfig().lockByDefault
            ? config.expandedConfig().onLock
            : null

        if (!onLock) return
        onLock(nodeView)
    }

    private expandNode(tanaNode:TanaNode,config:NodeViewConfig<any>,nodeViewType:NodeViewType) {
        const shouldExpand = nodeViewType == NodeViewType.Default && config.defaultConfig().expandByDefault
        if (!shouldExpand) return
        TanaCommandExecutor.expandTanaNode(tanaNode)
    }

}

export const TanaNodeViewCreator = (doc:Document) => new _TanaNodeViewCreator(doc)

export default TanaNodeViewCreator(document)




