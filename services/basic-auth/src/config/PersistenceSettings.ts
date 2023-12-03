import { LoadConfig } from '@dms/config';
import { PersistenceConfig } from '@dms/persistence/lib/config/PersistenceConfig';

@LoadConfig('database')
export class DMSPersistenceSettings extends PersistenceConfig {}
