import {DOMWindow, JSDOM} from "jsdom";


export const createJSDOM = () => {
    const {window} = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)
    //@ts-ignore
    global.MutationObserver = window.MutationObserver
    return {window,document:window.document}
}



export const toNodeList = (doc:Document,nodeArray:Node[]) => {
    const fragment = doc.createDocumentFragment();
    nodeArray.forEach(function(item){
        fragment.appendChild(item.cloneNode());
    });
    return fragment.childNodes;
}