export interface AppState {
    nodeSpace:NodeSpace
    transactionStore: TransactionStore
     getAllSystemNodes: () => Iterator<TanaNode>
}

export interface Iterator<T> {
    next: () => {value: T, done:boolean}
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
    getOrCreateSchemaNode: () => TanaNode
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

export interface MetaNode {
    getOrCreateTupleByAttributeId:(attributeId:string) => TanaNode
}

export interface TanaNode {
    id:string 
    docType?: string 
    insertTuple: (node:TanaNode,type:string) => void
    addTemplate: (template:TanaNode) => void
    runInitializations: () => void
    name:string
    tupleValue:TanaNode
    isCodeBlock:boolean
    metaNode?:MetaNode
    templates:TanaNode[]
    nodeSpace: NodeSpace
    addChild: (node:TanaNode) => TanaNode
    systemNodes
    parentFile: TanaFile
    isSystemNode:boolean
    children: TanaNode[]
    isTemplate: boolean
    insertNewNodeAtEnd: () => TanaNode
}

export interface TanaWindow extends Window {
    appState: AppState
}


