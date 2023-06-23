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
    const [prevElements, setPrevElements] = useState<readonly any[]>(Maybe.fromNullable(initialData.elements).orDefault([]))
    
    const hasChanged = (elements: readonly any[]) => {
        if (elements.length !== prevElements!.length) return true
        for (let i = 0; i < elements.length; i++) {
            const curr = elements[i]
            const prev = prevElements![i]
            if (!_.isEqual(curr,prev)) return true
        }
        return false
    }

    function handleOnChange(elements: readonly ExcalidrawElement[], appState: AppState) {
        if (hasChanged(elements)) {
            setPrevElements(elements)
            stateHandler.saveData(tanaNode.id,elements)

        }
    }

    useEffect(() => {
        resolve(container)
      }, []);  

      
    useDropEffect(excalidrawRef.current,excalidrawAPI)

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