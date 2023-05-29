export interface AppState {
    nodeSpace:NodeSpace;
    transactionStore: TransactionStore
}
export interface TransactionStore {
    isProcessing: boolean
}
export interface changeRecord {
    changeType: number
    created: number
    id:string
    optimisticTransId: string
    userEmail: string
    JSON: string
    name: string
    skipPersist: boolean
}
export interface  TanaInfo {
    fromNetwork: boolean
}
export interface NodeSpace {
    navigatorService: NavigationService
    subscribeToChanges:(subscriptionCallback:(idList:string[],changeRecord:changeRecord,info:TanaInfo) => void) => void
    nodeMap: Map<string,TanaNode|null>;
}
export interface TanaPageState {
    pathname:string
    search:string
    hash:string
    key:string
    state: {
        firstPage: boolean,
        idx: number,
        layoutId: string
    }
}
export interface TanaHistory {
    listen: (callback:(state:TanaPageState,action:string) => void) => void
}
export interface NavigationService {
    history: TanaHistory
}
export interface TanaNode {
    name:string
    isCodeBlock:boolean
    templates:TanaNode[]
}
export interface TanaWindow extends Window {
    appState: AppState
}


