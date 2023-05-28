import CodeBlockComponentAccessor from "./CodeBlockComponentAccessor";
import {
    CODE_BLOCK_INPUT_CSS_SELECTOR,
    CODE_BLOCK_LINTING_CSS_SELECTOR
} from "./types";
import highlightJS from "highlight.js"
import TanaDomNodeProvider from "tana-extensions-core/src/TanaDOMNodeProvider";
import TanaStateProvider from "tana-extensions-core/src/TanaStateProvider";

export default new class CodeEventHandler {
    public  registerBaseEventsForCodeBlock(codeBlockContainer:HTMLElement) {
        const inputElement = codeBlockContainer.querySelector(CODE_BLOCK_INPUT_CSS_SELECTOR) as HTMLTextAreaElement
        this.registerPreventAutomaticBlurEvent(codeBlockContainer)
        this.registerCoordinateElementScrollEvent(inputElement)
        this.registerSyncChangesOnInputElementInputEvent(inputElement)
    }

    public  invokeInitialization(codeBlockContainer: HTMLElement) {
        const inputElement = codeBlockContainer.querySelector(CODE_BLOCK_INPUT_CSS_SELECTOR) as HTMLTextAreaElement
        const lintingElement = codeBlockContainer.querySelector(CODE_BLOCK_LINTING_CSS_SELECTOR) as HTMLElement
        inputElement.style.height = "auto"
        inputElement.style.height = inputElement.scrollHeight + "px"
        lintingElement.style.height = inputElement.style.height
        highlightJS.highlightElement(lintingElement)
    }

    private  registerPreventAutomaticBlurEvent(codeBlockContainerElement:HTMLElement) {
        codeBlockContainerElement.addEventListener("click", (event)=>{
                event.preventDefault()
                event.stopPropagation()
            }
        )
    }
    private  registerCoordinateElementScrollEvent(inputElement:HTMLTextAreaElement) {
        inputElement.addEventListener("scroll", (event) => {
            const lintingElement = CodeBlockComponentAccessor.getCodeBlockLintingElementFromEvent(event)
            window.requestAnimationFrame(() => {
                const {scrollTop} = event.target as HTMLElement
                lintingElement!.scrollTop = scrollTop
                console.log(`[${scrollTop == lintingElement!.scrollTop}] ScrollingSame Input scrollTop ${scrollTop}. Linting scrollTop ${lintingElement!.scrollTop}`)
            });
        })
    }

    private  registerSyncChangesOnInputElementInputEvent(inputElement:HTMLTextAreaElement) {
        inputElement.addEventListener("input", (event) => {
            const inputElement = event.target as HTMLTextAreaElement
            const lintingElement = CodeBlockComponentAccessor.getCodeBlockLintingElementFromEvent(event)
            lintingElement!.textContent = inputElement.value
            const tanaElement = CodeBlockComponentAccessor.getCodeBlockTanaNodeFromEvent(event)
            const id = TanaDomNodeProvider.getIdFromElement(tanaElement as HTMLElement)
            const tanaNode = TanaStateProvider.getNodeWithId(id!)
            tanaNode!.name = inputElement.value
            this.invokeRefreshLintingElementHighlightsEvent(event)
            this.invokeUpdateCodeBlockSizeEvent(event)
        })
    }

    private  invokeRefreshLintingElementHighlightsEvent(event:Event) {
        const lintingElement = CodeBlockComponentAccessor.getCodeBlockLintingElementFromEvent(event) as HTMLElement
        highlightJS.highlightElement(lintingElement)
    }

    private   invokeUpdateCodeBlockSizeEvent(event:Event) {
        const inputElement = CodeBlockComponentAccessor.getCodeBlockInputElementFromEvent(event) as HTMLTextAreaElement
        const lintingElement = CodeBlockComponentAccessor.getCodeBlockLintingElementFromEvent(event) as HTMLElement
        inputElement.style.height = "auto"
        inputElement.style.height = inputElement.scrollHeight + "px"
        lintingElement.style.height = inputElement.style.height
    }

}