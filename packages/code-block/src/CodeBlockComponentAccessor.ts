import {
    CODE_BLOCK_CONTAINER_CSS_SELECTOR,
    CODE_BLOCK_INPUT_CSS_SELECTOR,
    CODE_BLOCK_LINTING_CSS_SELECTOR
} from "./types";
import TanaDomNodeProvider from "tana-extensions-core/src/TanaDOMNodeProvider";

export default new class CodeBlockComponentAccessor {
    public  getCodeBlockContainerFromEvent(event:Event) {
        const element = event.target as HTMLElement
        return element.closest(CODE_BLOCK_CONTAINER_CSS_SELECTOR)
    }

    public  getCodeBlockTanaNodeFromEvent(event:Event) {
        const node = event.target as HTMLElement
        return TanaDomNodeProvider.getBlockNodeFromDescendant(node)
    }

    public  getCodeBlockInputElementFromEvent(event:Event) {
        const container = this.getCodeBlockContainerFromEvent(event)
        return container!.querySelector(CODE_BLOCK_INPUT_CSS_SELECTOR)
    }

    public  getCodeBlockLintingElementFromEvent(event:Event) {
        const container = this.getCodeBlockContainerFromEvent(event)
        return container!.querySelector(CODE_BLOCK_LINTING_CSS_SELECTOR)
    }

}