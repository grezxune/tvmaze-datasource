import { type AppContext } from '../../context.js';
import { UpstreamServiceError } from '../../datasources/tvmaze-api.js';
import { mapRestShowToShow } from './show.mapper.js';
import { type ShowLookupResult, type ShowModel } from './show.types.js';

interface ShowQueryArgs {
  id: string;
}

const normalizeShowId = (id: string): string => id.trim();

const isValidShowId = (id: string): boolean => /^\d+$/.test(id) && Number(id) > 0;

export const showResolvers = {
  Query: {
    show: async (_parent: unknown, arguments_: ShowQueryArgs, context: AppContext): Promise<ShowLookupResult> => {
      const normalizedId = normalizeShowId(arguments_.id);

      if (!isValidShowId(normalizedId)) {
        return {
          show: null,
          error: {
            code: 'INVALID_INPUT',
            message: 'Show id must be a positive integer.',
          },
        };
      }

      try {
        const restShow = await context.dataSources.tvMazeApi.getShowById(normalizedId);

        if (!restShow) {
          return {
            show: null,
            error: {
              code: 'NOT_FOUND',
              message: `No show found for id "${normalizedId}".`,
            },
          };
        }

        return {
          show: mapRestShowToShow(restShow),
          error: null,
        };
      } catch (error) {
        if (error instanceof UpstreamServiceError) {
          return {
            show: null,
            error: {
              code: 'UPSTREAM_ERROR',
              message: 'TVMaze is currently unavailable.',
            },
          };
        }

        throw error;
      }
    },
  },

  Show: {
    summary: (show: ShowModel): string => {
      const genre = show.genre ?? 'UNKNOWN';
      const detail = show.detail ?? 'No language listed';

      return `${show.name} (${show.id}) is a show in ${genre}. Detail: ${detail}. Rating: ${show.metric}.`;
    },
  },
};
