import { Excalidraw } from "@excalidraw/excalidraw";
import React, { useRef, useState } from "react";
import ExcalidrawContainer from "./ExcalidrawContainer";
import { AppState, ExcalidrawAPIRefValue, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import useDropEffect from "./useDropEffect";
import _ from "lodash";
import ExcalidrawStateHandler from "../ExcalidrawStateHandler";
import { TanaNode } from "tana-extensions-core/src/StaticModules/TanaStateProvider/types/types";
import { Maybe } from "purify-ts/Maybe";

export interface ExcalidrawProps {
    initialData:ExcalidrawInitialDataState
    stateHandler:ExcalidrawStateHandler
    tanaNode:TanaNode
}

export default function App({initialData,stateHandler,tanaNode}:ExcalidrawProps) {
    const excalidrawRef = useRef<HTMLDivElement>(null)
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPIRefValue|null>(null);
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

    useDropEffect(excalidrawRef.current,excalidrawAPI)

    return (
        <ExcalidrawContainer ref={excalidrawRef}>
            <Excalidraw
                ref={(api) => setExcalidrawAPI(api)} 
                autoFocus={false}
                onChange={handleOnChange}
                initialData={initialData}
            />
        </ExcalidrawContainer>
    )
}