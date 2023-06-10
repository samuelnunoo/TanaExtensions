import TanaPubSubModule from "../ReactiveModules/EventBus/types/TanaPubSubModule";


export default abstract class TanaExtension extends TanaPubSubModule {
    abstract getUniqueIdentifier(): string
}