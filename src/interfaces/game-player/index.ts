import { UserInterface } from 'interfaces/user';
import { StartupInterface } from 'interfaces/startup';
import { GetQueryInterface } from 'interfaces';

export interface GamePlayerInterface {
  id?: string;
  user_id?: string;
  startup_id?: string;
  investment?: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  startup?: StartupInterface;
  _count?: {};
}

export interface GamePlayerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  startup_id?: string;
}
