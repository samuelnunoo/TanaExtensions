import CodeBlockComponentAccessor from "./CodeBlockComponentAccessor";
import TanaStateProvider from "../../TanaStateProvider";
import {
    CODE_BLOCK_INPUT_CSS_CLASS,
    CODE_BLOCK_INPUT_CSS_SELECTOR,
    CODE_BLOCK_LINTING_CSS_CLASS,
    CODE_BLOCK_LINTING_CSS_SELECTOR
} from "./types";
import highlightJS from "highlight.js"
import TanaDomNodeProvider from "../../TanaDOMNodeProvider";
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
        lintingElement.style.height = `${inputElement.style.height}px`
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
            const{ scrollTop } = event.target as HTMLElement
            const lintingElement = CodeBlockComponentAccessor.getCodeBlockLintingElementFromEvent(event)
            lintingElement!.scrollTop = scrollTop
        })
    }

    private  registerSyncChangesOnInputElementInputEvent(inputElement:HTMLTextAreaElement) {
        inputElement.addEventListener("input", (event) => {
            const inputElement = event.target as HTMLTextAreaElement
            const lintingElement = CodeBlockComponentAccessor.getCodeBlockLintingElementFromEvent(event)
            lintingElement!.innerHTML = inputElement.value
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
        lintingElement.style.height = `${inputElement.style.height}px`
    }

}