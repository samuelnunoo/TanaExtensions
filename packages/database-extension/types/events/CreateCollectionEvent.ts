import DBCollection from '../database/DBCollection';
import RuntimeEventStatic from 'tana-extensions-core/src/ReactiveModules/EventBus/types/RuntimeEventStatic';

export interface CreateCollectionMessage {
    collection: DBCollection<any>
}

export default new RuntimeEventStatic<CreateCollectionMessage>("CreateCollectionEvent")