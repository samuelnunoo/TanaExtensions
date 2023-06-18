import RuntimeEventStatic from "../../../EventBus/types/RuntimeEventStatic";
import {NodeEventMessage} from "../../../TanaDomNodeEventPublisher/types/NodeEvent";


export enum ReplaceViewEnum {
    Insertion = "insertion",
    Deletion = "deletion"
}
export interface ReplaceViewEventMessage {
    type: ReplaceViewEnum
    nodeEvent: NodeEventMessage
}

export default new RuntimeEventStatic<ReplaceViewEventMessage>("replaceViewEvent")