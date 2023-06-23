import RuntimeEventStatic from "../../EventBus/types/RuntimeEventStatic";
import {PanelContainerType, PanelEvenTypeEnum} from "./types";


export interface PanelEventMessage {
    panel:HTMLElement
    panelContainerType: PanelContainerType
    panelEventType: PanelEvenTypeEnum
    panelId:string
}


export default new RuntimeEventStatic<PanelEventMessage>("PanelEvent")