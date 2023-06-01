

export default interface ITanaLifeCycleListener {
    onStart(): Promise<void>
    onAppStateInitialized(): Promise<void>
    onDomRenderComplete(): Promise<void>
}