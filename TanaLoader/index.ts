import {TANA_MAIN_UI_CONTAINER_CLASS_PREFIX, TANA_REACT_APP_ID} from "./types";

export default new class TanaLoader {
    public async waitForFieldToInstantiate(object:Object,key:string) {
        return new Promise((resolve) => {
            Object.defineProperty(object, key, {
                configurable: true,
                set(v){
                    Object.defineProperty(object, key, {
                        configurable: true, enumerable: true, writable: true, value: v });
                    resolve(true)
                }
            });
        })
    }

    public async waitForPageDOMToCompleteInitialization() {
        return new Promise((resolve) => {
            const app = document.getElementById(TANA_REACT_APP_ID)!
            new MutationObserver((mutationList:MutationRecord[],observer:MutationObserver) => {
                for (const mutation of mutationList) {
                    if (this.mainUIContainerHasBeenAdded(mutation)) {
                        observer.disconnect()
                        resolve(true)
                    }
                }
            }).observe(app,{
                childList:true,
                subtree:true
            })
        })
    }

    private mainUIContainerHasBeenAdded(mutation:MutationRecord): boolean {
        for (const addedNode of Array.from(mutation.addedNodes) as HTMLElement[]){
            const mainUIContainer =
                Array.from(addedNode.classList)
                    .find(cssClass => cssClass.match(TANA_MAIN_UI_CONTAINER_CLASS_PREFIX))
            if (!!mainUIContainer) return true
        }
        return false
    }


}