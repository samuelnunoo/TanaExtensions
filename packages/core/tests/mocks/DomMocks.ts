/*

These mocks are not complete but 
mock key attributes used during validations.

Additional child nodes may need to be added for your
purposes.

*/

import {Window} from "happy-dom";
import path from "path";
import fs from "fs";

export const panelWithAncestors = (doc:Document) => {

    const _dockContainer = dockContainer(doc)
    const _mainDock = mainDock(doc)
    const _mainDockPanelContainer = mainDockPanelContainer(doc)
    const _panel = panelDiv(doc)
    const _panelHeader = panelHeader(doc)

    _dockContainer.appendChild(_mainDock)
    _mainDock.appendChild(_mainDockPanelContainer)
    _mainDockPanelContainer.appendChild(_panel)
    _panel.appendChild(_panelHeader)

    return _panel
}

export const dockContainer = (doc:Document) => {
    const div = doc.createElement("div")
    div.setAttribute("data-role","layout-and-docks")
    return div
}
export const mainDock = (doc:Document) => {
    const div = doc.createElement("div")
    div.setAttribute("data-role","layout-builder")
    return div
}

export const mainDockPanelContainer = (doc:Document) => {
    const div = doc.createElement("div")
    div.classList.add("PanelStack-module_horizontalSplit__N2ysk")
    return div
}

export const panelDiv = (doc:Document) => {
    const div = doc.createElement("div")
    div.setAttribute("data-panel-id","panelId")
    return div
}

export const wrapAndEditableMenu = (doc:Document) => {
    const div = doc.createElement("div")
    div.classList.add(TANA_WRAPPER_CSS_CLASS)
    div.setAttribute("data-editable-wrapper","true")
    return div
}

export const editableSpan = (doc:Document) => {
    const span = doc.createElement("span")
    span.id = "span"
    span.setAttribute("data-editable-wrapper","true")
    span.classList.add("editable")
    span.classList.add("nodrop")
    span.setAttribute("data-editable","true")
    span.setAttribute("contenteditable","true")
    return span
}

export const  templateContainer = (doc:Document) => {
    const div = doc.createElement("div")
    div.classList.add("PanelHeader-module_templates__ws-uF")
    return div
}

export const templateButton = (doc:Document) => {
    const span = doc.createElement("span")
    span.classList.add("templateNameList")
    span.classList.add("TemplateTags-module_tags__97sfp")
    span.setAttribute("data-role","template-list")
    return span
}

export const panelHeader = (doc) =>  {
    const headerContainer = wrapAndEditableMenu(doc)
    headerContainer.appendChild(editableSpan(doc))
    headerContainer.appendChild(templateContainer(doc))
    return headerContainer
}

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


export const getNodeWithTemplateContent = (doc:Document) => {
    return doc.querySelector('[data-id="z5oiLLETKg|u8o-Nx_aig|qPVwIT3wX9|ehTmtoM4sM"]')
}
export const getFakeNodeView = (doc:Document) => {
    const div = doc.createElement("div")
    const paths = path.resolve("tests/mocks/fakeNodeViewElement.html")
    const fileContent = fs.readFileSync(paths, 'utf8');
    div.innerHTML = fileContent
    div.classList.add("epic-node-view")
    return div as Node
}


export const getFakeMethodsNode = (doc:Document) => {
    return doc.querySelector('[data-id="z5oiLLETKg|u8o-Nx_aig|qPVwIT3wX9"]')
}

export const setupFakeTanaDOM = () => {
    const window = new Window();
    const document = window.document;
    const paths = path.resolve("tests/mocks/FakeTanaDOM.html")
    const fileContent = fs.readFileSync(paths, 'utf8');
    const trimmedFileContent = fileContent.replaceAll(/\n|\r|\s{2,}/g, "");
    document.body.innerHTML = trimmedFileContent
    return {window, document}
}
export const getTestApproachBullet = (doc: Document) => {
    return doc.querySelector('[data-id="z5oiLLETKg|u8o-Nx_aig|o1UqiAdoam"]')
}