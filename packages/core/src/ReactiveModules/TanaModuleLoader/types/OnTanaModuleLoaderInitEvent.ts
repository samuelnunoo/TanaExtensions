import {InitEvent} from "../../EventBus/types/Event";


export default new class OnTanaModuleLoaderInitEvent extends InitEvent {
    getIdentifier(): string {
        return "onTanaModuleLoaderInitEvent";
    }


}