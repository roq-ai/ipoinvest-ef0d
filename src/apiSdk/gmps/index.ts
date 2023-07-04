import axios from 'axios';
import queryString from 'query-string';
import { GmpInterface, GmpGetQueryInterface } from 'interfaces/gmp';
import { GetQueryInterface } from '../../interfaces';

export const getGmps = async (query?: GmpGetQueryInterface) => {
  const response = await axios.get(`/api/gmps${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGmp = async (gmp: GmpInterface) => {
  const response = await axios.post('/api/gmps', gmp);
  return response.data;
};

export const updateGmpById = async (id: string, gmp: GmpInterface) => {
  const response = await axios.put(`/api/gmps/${id}`, gmp);
  return response.data;
};

export const getGmpById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/gmps/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGmpById = async (id: string) => {
  const response = await axios.delete(`/api/gmps/${id}`);
  return response.data;
};
