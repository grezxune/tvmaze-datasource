import { TvMazeApi, type TvMazeApiContract } from './datasources/tvmaze-api.js';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

export interface AppContext {
  dataSources: {
    tvMazeApi: TvMazeApiContract;
  };
}

export const createContext = (): AppContext => ({
  dataSources: {
    tvMazeApi: new TvMazeApi(TVMAZE_BASE_URL),
  },
});
