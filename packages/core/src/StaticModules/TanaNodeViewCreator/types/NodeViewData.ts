export default interface NodeViewData {
    event:RuntimeEVentInstance<ReplaceViewEventMessage>
    config:NodeViewConfig<any>
    nodeView:HTMLDivElement
}