//Basic
import { StorageConfig } from '@ionic/storage';

//Constants
import { DB_NAME } from '../core/constants/storage.constants';

/**
 * Configuraton for the storage service
 */
export const roomConfig = {
  databaseConfig: <StorageConfig>{
    name: `${DB_NAME.NAME}_v${DB_NAME.VERSION}.${DB_NAME.SUFFIX}`,
    storeName: '_room',
    driverOrder: ['indexeddb', 'sqlite', 'websql']
  },
  encryption: false
};