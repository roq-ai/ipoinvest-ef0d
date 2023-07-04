import { GamePlayerInterface } from 'interfaces/game-player';
import { GmpInterface } from 'interfaces/gmp';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface StartupInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  game_player?: GamePlayerInterface[];
  gmp?: GmpInterface[];
  user?: UserInterface;
  _count?: {
    game_player?: number;
    gmp?: number;
  };
}

export interface StartupGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
