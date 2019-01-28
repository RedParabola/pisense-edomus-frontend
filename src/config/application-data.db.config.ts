//Basic
import { StorageConfig } from '@ionic/storage';

//Constants
import { DB_NAME } from '../core/constants/storage.constants';

/**
 * Configuraton for the storage service
 */
export const applicationDataConfig = {
  databaseConfig: <StorageConfig>{
    name: `${DB_NAME.NAME}_v${DB_NAME.VERSION}.${DB_NAME.SUFFIX}`,
    storeName: '_applicationData',
    driverOrder: ['indexeddb', 'sqlite', 'websql']
  },
  encryption: false
};