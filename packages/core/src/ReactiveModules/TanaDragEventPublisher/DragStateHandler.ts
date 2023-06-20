
export default class DragStateHandler {
    private moveCount: number = 0
    private onMouseDownTanaNodeId:string = ""
    private onMouseDownContentNode:HTMLElement|null = null
    private hoverElement:HTMLElement|null = null 


    setContentNode(contentNode:HTMLElement) {
        this.onMouseDownContentNode = contentNode
    }

    getContentNode() {
        return this.onMouseDownContentNode
    }

    clearContentNode() {
        this.onMouseDownContentNode = null 
    }

    setHoverElement(hoverElement:HTMLElement) {
        this.hoverElement = hoverElement
    }

    resetHoverElement() {
        this.hoverElement = null 
    }

    getHoverElement() {
        return this.hoverElement
    }

    incrementMoveCount() {
        this.moveCount++
    }

    resetMoveCount() {
        this.moveCount = 0
    }

    getMoveCount() {
        return this.moveCount
    }

    setTanaNodeId(nodeId:string) {
        this.onMouseDownTanaNodeId = nodeId 
    }

    clearTanaNodeId() {
        this.onMouseDownTanaNodeId = ""
    }

    getTanaNodeId() {
        return this.onMouseDownTanaNodeId
    }

}