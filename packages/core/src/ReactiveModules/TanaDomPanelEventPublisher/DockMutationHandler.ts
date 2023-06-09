


export default class DockMutationHandler {

    private handleDockContainerChildListMutationEvent(mutationList: MutationRecord[], observer: MutationObserver) {
        for (const mutation of mutationList) {
            this.unobserveDocks(Array.from(mutation.removedNodes) as HTMLElement[])
            this.observeDocks(Array.from(mutation.addedNodes) as HTMLElement[])
            this.invokeDockEvent(mutation)
        }
    }


    private handleMainDockChildListMutationEvent(mutationList: MutationRecord[]) {
        for (const mutation of mutationList) {
            if (!this.mediator.mutationInvolvesPanelContainer(mutation)) continue
            const isRemove = mutation.removedNodes.length > 0
            const panelContainer = mutation.target as HTMLElement
            const panel = panelContainer.querySelector(TANA_DATA_PANEL_CSS_SELECTOR) as HTMLElement
            Maybe.fromNullable(panel.getAttribute(TANA_DATA_PANEL_ATTRIBUTE))
                .map(dataPanelId => {
                    this.mediator.dispatchPanelEvent(
                        panel, panelContainer,dataPanelId,isRemove
                    )
                })
        }
    }


    

}