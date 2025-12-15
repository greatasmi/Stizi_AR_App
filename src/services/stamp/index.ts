import api from '../api';
import { Stamp } from '../../types';

export const stampService = {
  getNearbyStamps: async (
    latitude: number,
    longitude: number,
    radius: number = 5000
  ): Promise<{ stamps: Stamp[] }> => {
    const { data } = await api.get('/stamps/nearby', {
      params: { latitude, longitude, radius },
    });
    return data;
  },

  createStamp: async (data: {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
  }): Promise<{ stamp: Stamp }> => {
    const response = await api.post('/stamps', data);
    return response.data;
  },

  collectStamp: async (qrCode: string): Promise<{ stamp: Stamp }> => {
    const response = await api.post('/stamps/collect', { qrCode });
    return response.data;
  },

  getMyStamps: async (): Promise<{ stamps: Stamp[] }> => {
    const response = await api.get('/stamps/my-stamps');
    return response.data;
  },
};
