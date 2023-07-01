import { Maybe } from "purify-ts";
import TanaNodeViewModule from ".";
import TanaDomNodeProvider from "../../StaticModules/TanaDomNodeProvider";
import { InitEvent } from "../EventBus/types/Event";
import TanaSubscriber from "../EventBus/types/TanaSubscriber";
import INodePortalListener from "./types/INodePortalListener";
import _ from 'lodash';
import OnStartEvent from "../TanaLoaderModule/types/OnStartEvent";
import NodePortal from "../../StaticModules/NodePortalModules/NodePortal";


export default class NodePortalObserver extends TanaSubscriber<TanaNodeViewModule> implements INodePortalListener {
    private panelObservers:Map<HTMLElement,{prevScrollPos:number,panelPortals:Set<HTMLElement>}> = new Map()

    onPortalPresenceChange(portal: NodePortal, isRemoved: boolean): void {
        Maybe.fromNullable(TanaDomNodeProvider.getPanelFromDescendant(portal.getPortalDomNode()) as HTMLElement)
            .chainNullable(panel =>  this.panelObservers.get(panel))
            .chainNullable(panelData => {
                if (isRemoved) panelData.panelPortals.delete(portal.getPortalDomNode())
                else panelData.panelPortals.add(portal.getPortalDomNode())
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