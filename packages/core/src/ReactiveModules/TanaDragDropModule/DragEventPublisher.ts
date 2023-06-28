import { Maybe } from "purify-ts";
import TanaDragDropModule from ".";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import { InitEvent } from "../EventBus/types/Event";
import TanaPublisher from "../EventBus/types/TanaPublisher";
import OnDomRenderCompleteEvent from "../TanaLoaderModule/types/OnDomRenderCompleteEvent";
import EventBus from "../EventBus";
import OnDropEvent, { DropEventContent } from "./types/OnDropEvent";
import { TanaNode } from "../../StaticModules/TanaStateProvider/types/types";
import TanaNodeAttributeInspector from "../../StaticModules/TanaNodeAttributeInspector";
import { VIEW_EXTENSION_TEMPLATE } from "../TanaNodeViewModule/types/constants";

const MOVE_COUNT_THRESHOLD = 15 

export default class DragEventPublisher extends TanaPublisher<TanaDragDropModule> {
    private doc: Document

    constructor(mediator:TanaDragDropModule,eventBus:EventBus,doc:Document) {
        super(mediator,eventBus)
        this.doc = doc 
    }

    getInitRequirements(): InitEvent[] {
       return [
        OnDomRenderCompleteEvent
       ]
    }

    onDependenciesInitComplete() {
        this.initEvents()
    }

    private initEvents() {
        this.initMouseDownEvent()
        this.initMouseUpEvent()
        this.initMouseMoveEvent()
        this.initMouseOverEvent()
    }

    private invokeDropEvent(
        draggedTanaNodeId:string,mouseEvent:MouseEvent,draggedContentNode:HTMLElement,
        dropTarget:HTMLElement,targetNodeViewContainer:HTMLElement,targetTanaNode:TanaNode,nodeViewTemplateId:string,
        nodeElement:HTMLElement, isExpanded:boolean
        ) {
        const content =  {
            draggedTanaNodeId,
            mouseEvent,
            targetNodeViewContainer,
            draggedContentNode,
            targetTanaNode,
            dropTarget,
            nodeViewTemplateId,
            nodeElement,
            isExpanded
        } as DropEventContent


        const dropEvent = OnDropEvent.createInstance(content)
        this.dispatchRuntimeEvent(dropEvent)
    }

    private initMouseDownEvent() {
        this.doc.addEventListener("mousedown",(event) => {
            Maybe.fromNullable(TanaDomNodeProvider.getContentNodeFromDescendant(event.target as HTMLElement) as HTMLElement)
                .map(contentNode => {
                    const tanaNodeId = TanaDomNodeProvider.getIdFromElement(contentNode)
                    if (!tanaNodeId) return
                    if (this.isNodeView(contentNode)) return 
                    this.mediator.getDragStateHandler().setTanaNodeId(tanaNodeId)
                    this.mediator.getDragStateHandler().setContentNode(contentNode)
                    console.log("mousedown")
                })
        })
    }

    private isNodeView(contentNode:HTMLElement) {
       return !!TanaDomNodeProvider.getNodeViewFromDescendant(contentNode)
    }

    private initMouseMoveEvent() {
        this.doc.addEventListener("mousemove", () => {
            this.mediator.getDragStateHandler().incrementMoveCount()
        })
    }

    private isDragHand(event:Event) {
        return event.target && (event.target as HTMLElement).classList.contains("dragHand")
    }

    private initMouseOverEvent() {
        this.doc.addEventListener("mouseover",(event) => {
            if (this.isDragHand(event)) return this.mediator.getDragStateHandler().setDragHandleExists(true)
            this.mediator.getDragStateHandler().setHoverElement(event.target as HTMLElement)
        })
    }

    private initMouseUpEvent() {
        this.doc.addEventListener("mouseup",(event) => {
            const moveCount = this.mediator.getDragStateHandler().getMoveCount()
            const tanaNodeId = this.mediator.getDragStateHandler().getTanaNodeId()
            const hoverElement = this.mediator.getDragStateHandler().getHoverElement()
            const contentNode = this.mediator.getDragStateHandler().getContentNode()
            const hasDragHandler = this.mediator.getDragStateHandler().getDragHandleStatus()
          
            if (moveCount < MOVE_COUNT_THRESHOLD) return 
            if (!tanaNodeId) return 
            if (!hoverElement) return 
            if (!contentNode) return 
            if (!hasDragHandler) return 
            const nodeView = TanaDomNodeProvider.getNodeViewFromDescendant(hoverElement)
            if (!nodeView) return
            const targetTanaNode = TanaDomNodeProvider.getTanaNodeForNodeView(nodeView)
            if (!targetTanaNode) return 
            const templateId = TanaNodeAttributeInspector.getFirstTemplateWithSuperTag(targetTanaNode,VIEW_EXTENSION_TEMPLATE)
            if (!templateId) return 
            if (nodeView == contentNode || nodeView.contains(contentNode)) return 
            const nodeElement = TanaDomNodeProvider.getNodeViewParentNodeElement(nodeView)
            if (!nodeElement) return
            const isExpanded = TanaNodeAttributeInspector.hasPanelHeaderAttribute(nodeElement)
            this.invokeDropEvent(tanaNodeId,event,contentNode,hoverElement,nodeView,targetTanaNode,templateId.name,nodeElement,isExpanded)
            this.mediator.getDragStateHandler().resetAll()
        })
    }

}