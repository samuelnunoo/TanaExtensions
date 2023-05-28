import {TANA_MAIN_UI_CONTAINER_CLASS_PREFIX, TANA_REACT_APP_ID} from "./types";

export default new class TanaLoader {
    public async waitForFieldToInstantiate(object:Object,key:string) {
        return new Promise((resolve) => {
            if (key in object) return resolve(true)
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
            if (this.mainUIContainerHasBeenAdded(Array.from(app.children) as HTMLElement[])) return resolve(true)
            new MutationObserver((mutationList:MutationRecord[],observer:MutationObserver) => {
                for (const mutation of mutationList) {
                    if (this.mainUIContainerHasBeenAdded(Array.from(mutation.addedNodes) as HTMLElement[])) {
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
    private mainUIContainerHasBeenAdded(htmlElements:HTMLElement[]) {
        for (const htmlElement of htmlElements){
            const mainUIContainer =
                Array.from(htmlElement.classList)
                    .find(cssClass => cssClass.match(TANA_MAIN_UI_CONTAINER_CLASS_PREFIX))
            if (!!mainUIContainer) return true
        }
        return false
    }
}