import axios from 'axios';
import queryString from 'query-string';
import { GamePlayerInterface, GamePlayerGetQueryInterface } from 'interfaces/game-player';
import { GetQueryInterface } from '../../interfaces';

export const getGamePlayers = async (query?: GamePlayerGetQueryInterface) => {
  const response = await axios.get(`/api/game-players${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGamePlayer = async (gamePlayer: GamePlayerInterface) => {
  const response = await axios.post('/api/game-players', gamePlayer);
  return response.data;
};

export const updateGamePlayerById = async (id: string, gamePlayer: GamePlayerInterface) => {
  const response = await axios.put(`/api/game-players/${id}`, gamePlayer);
  return response.data;
};

export const getGamePlayerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/game-players/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGamePlayerById = async (id: string) => {
  const response = await axios.delete(`/api/game-players/${id}`);
  return response.data;
};
