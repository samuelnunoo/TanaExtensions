import { BULLET_CONTENT_CSS_CLASS, CONTENT_SIDE_CSS_CLASS } from '../../src/ReactiveModules/TanaDomNodeEventPublisher/types/types';
/*

These mocks are not complete but 
mock key attributes used during validations.

Additional child nodes may need to be added for your
purposes.

*/


export const expandedBlockContent = (doc) => {
    const block = blockContent(doc)
    block.appendChild(expandedNodeMock(doc))
    return block
}
export const blockContent = (doc) => {
    const blockContent = doc.createElement("div")
    blockContent.classList.add(BULLET_CONTENT_CSS_CLASS)
    return blockContent
}
export const expandedNodeMock = (doc) => {
    const expandedNode = doc.createElement("div")
    expandedNode.classList.add(CONTENT_SIDE_CSS_CLASS)
    expandedNode.classList.add("expanded")
    return expandedNode
}
