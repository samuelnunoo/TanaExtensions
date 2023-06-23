import { Excalidraw } from "@excalidraw/excalidraw";
import ExcalidrawContainer from "./ExcalidrawContainer";
import { AppState, ExcalidrawAPIRefValue, ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import useDropEffect from "./useDropEffect";
import _ from "lodash";
import ExcalidrawStateHandler from "../ExcalidrawStateHandler";
import { TanaNode } from "tana-extensions-core/src/StaticModules/TanaStateProvider/types/types";
import { Maybe } from "purify-ts/Maybe";
import {useEffect, useRef, useState }from "react"
import React from "react";
import TanaNodePortalState from "tana-extensions-core/src/StaticModules/TanaNodePortalRenderer/TanaNodePortalState";
import { ExcalidrawChangeEventContent, ON_CHANGE_EVENT } from '../../types/OnChangeEvent';
export interface ExcalidrawProps {
    initialData:ExcalidrawInitialDataState
    container:HTMLDivElement
    nodePortalState:TanaNodePortalState
    stateHandler:ExcalidrawStateHandler
    tanaNode:TanaNode
    resolve:any
}

export default function TanaExcalidraw({nodePortalState,initialData,stateHandler,tanaNode,resolve,container}:ExcalidrawProps) {

    const excalidrawRef = useRef<HTMLDivElement>(null)
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI|null>(null)
    const [prevElements, setPrevElements] = useState<readonly any[]>(Maybe.fromNullable(_.cloneDeep(initialData.elements)).orDefault([]))
    const [prevAppState, setAppState] = useState<AppState|null>(null)
    
    const elementsHaveChanged = (elements: readonly any[]) => {
        if (elements.length !== prevElements!.length) return true
        for (let i = 0; i < elements.length; i++) {
            const curr = elements[i]
            const prev = prevElements![i]
            if (!_.isEqual(curr,prev)) return true
        }
        return false
    }

    const keysToIgnore = new Set(['cursorButton', 'draggingElement', 'previousSelectedElementIds', 'selectedElementIds', 'selectionElement'])

    const diffKeys = (prevAppState:AppState,appState:AppState) => {
        return Object.keys(prevAppState!).reduce((result, key) => {
            if (!appState.hasOwnProperty(key)) {
                result.push(key);
            } else if (_.isEqual(prevAppState![key], appState[key])) {
                const resultKeyIndex = result.indexOf(key);
                result.splice(resultKeyIndex, 1);
            }
            return result;
        }, Object.keys(appState));
    }

    const appStateHasChanged = (appState:AppState) => {
       if (!prevAppState && !!appState) return true 
       const diffs = diffKeys(prevAppState!,appState)
       for (const diff of diffs) {
        if (!keysToIgnore.has(diff)) return true 
       }
       return false 

    }

    function handleOnChange(elements: readonly ExcalidrawElement[], appState: AppState) {
        if (elementsHaveChanged(elements) || appStateHasChanged(appState)) {
            setPrevElements(_.cloneDeep(elements))
            setAppState(_.cloneDeep(appState))
            stateHandler.saveData(tanaNode.id,elements)
            const ref = excalidrawRef.current
            if (!ref) return 

            const changeEvent = new CustomEvent<ExcalidrawChangeEventContent>(ON_CHANGE_EVENT,{
                detail: { elements, appState},
                bubbles:true 
            })
            ref.dispatchEvent(changeEvent)
        }
    }

    useEffect(() => {
        resolve(container)
      }, []);  

      
    useDropEffect(excalidrawRef.current,excalidrawAPI,nodePortalState)

    return (
        <ExcalidrawContainer ref={excalidrawRef}>
            <Excalidraw
                ref={(api) => {
                    if (!api) return 
                    api.readyPromise?.then(excalidrawAPI => setExcalidrawAPI(excalidrawAPI))
                }} 
                autoFocus={false}
                onChange={handleOnChange}
                initialData={initialData}
            />
        </ExcalidrawContainer>
    )
}