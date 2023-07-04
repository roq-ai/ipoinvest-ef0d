import { StartupInterface } from 'interfaces/startup';
import { GetQueryInterface } from 'interfaces';

export interface GmpInterface {
  id?: string;
  startup_id?: string;
  value?: number;
  created_at?: any;
  updated_at?: any;

  startup?: StartupInterface;
  _count?: {};
}

export interface GmpGetQueryInterface extends GetQueryInterface {
  id?: string;
  startup_id?: string;
}
