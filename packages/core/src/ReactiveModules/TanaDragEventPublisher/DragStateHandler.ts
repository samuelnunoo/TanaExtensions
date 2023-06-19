
export default class DragStateHandler {
    private moveCount: number = 0
    private onMouseDownTanaNodeId:string = ""
    private hoverElement:HTMLElement|null = null 

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