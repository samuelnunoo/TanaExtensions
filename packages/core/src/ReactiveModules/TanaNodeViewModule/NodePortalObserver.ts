import { Maybe } from "purify-ts";
import TanaNodeViewModule from ".";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import { InitEvent } from "../EventBus/types/Event";
import RuntimeEventInstance from "../EventBus/types/RuntimeEventInstance";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import DomPanelPublisherInitEvent from "../TanaPanelEventModule/types/DomPanelPublisherInitEvent";
import PanelEvent, { PanelEventMessage } from "../TanaPanelEventModule/types/PanelEvent";
import { PanelEvenTypeEnum } from "../TanaPanelEventModule/types/types";
import INodePortalListener from "./types/INodePortalListener";
import _ from 'lodash';
import OnStartEvent from "../TanaLoaderModule/types/OnStartEvent";


export default class NodePortalObserver extends TanaSubscriber<TanaNodeViewModule> implements INodePortalListener {
    private panelObservers:Map<HTMLElement,{prevScrollPos:number,panelPortals:Set<HTMLElement>}> = new Map()

    onPortalPresenceChange(portal: HTMLElement, isRemoved: boolean): void {
        Maybe.fromNullable(TanaDomNodeProvider.getPanelFromDescendant(portal) as HTMLElement)
            .chainNullable(panel =>  this.panelObservers.get(panel))
            .chainNullable(panelData => {
                if (isRemoved) panelData.panelPortals.delete(portal)
                else panelData.panelPortals.add(portal)
            } )
    }

    getInitRequirements(): InitEvent[] {
       return [
        OnStartEvent
       ]
    }

    onDependenciesInitComplete() {
    }


}