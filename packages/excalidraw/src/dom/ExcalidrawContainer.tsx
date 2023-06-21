import React from "react"
import { useState } from "react"
import TanaDomNodeProvider from "tana-extensions-core/src/StaticModules/TanaDomNodeProvider"


const ExcalidrawContainer = React.forwardRef<HTMLDivElement,React.HTMLProps<HTMLDivElement>>((props,ref) => {
    const [hasFocus, setFocus] = useState(false)
  
    return (
        <div 
            ref={ref}
            className = "excalidraw-dimension"
            onWheelCapture = { e =>  { if (!hasFocus) e.stopPropagation() }}
            onClick = { _ => setFocus(true) }
            onBlur = { ({relatedTarget}) => {
                if (!relatedTarget || TanaDomNodeProvider.getViewPanelContainerFromDescendant(relatedTarget as HTMLElement)) {
                    setFocus(false)
                }}}
        >
            {props.children}
        </div>
    )
})

export default ExcalidrawContainer