export interface AppState {
    nodeSpace:NodeSpace;
    transactionStore: TransactionStore
}

export interface SystemNodes {
    codeBlockLangAttr: TanaNode
}

export interface TransactionStore {
    isProcessing: boolean
}

export interface ChangeRecord {
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
    templateList: TanaNode[]
    navigatorService: NavigationService
    subscribeToChanges:(subscriptionCallback:(idList:string[], changeRecord:ChangeRecord, info:TanaInfo) => void) => void
    nodeMap: Map<string,TanaNode|null>;
    homeNode: TanaNode
    userSettings: UserSettings
    systemNodes:SystemNodes
}

export interface TanaFile {

}

export interface UserSettings {
    getOrCreateSettingsNodeFor: (file:TanaFile) => TanaNode
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
    id:string 
    docType: string
    insertTuple: (node:TanaNode,type:string) => void
    addTemplate: (template:TanaNode) => void
    runInitializations: () => void
    name:string
    isCodeBlock:boolean
    templates:TanaNode[]
    nodeSpace: NodeSpace
    systemNodes
    parentFile: TanaFile
    insertNewNodeAtEnd: () => TanaNode
}

export interface TanaWindow extends Window {
    appState: AppState
}


