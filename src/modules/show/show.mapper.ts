import { type RestShowRecord } from '../../datasources/tvmaze-api.js';
import { type ShowGenre, type ShowModel } from './show.types.js';

const genreByApiValue: Record<string, ShowGenre> = {
  COMEDY: 'COMEDY',
  DRAMA: 'DRAMA',
  'SCIENCE-FICTION': 'SCIENCE_FICTION',
  'SCIENCE FICTION': 'SCIENCE_FICTION',
};

const isPresentString = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const toGenre = (genreName: string | null | undefined): ShowGenre | null =>
  genreByApiValue[genreName?.trim().toUpperCase() ?? ''] ?? null;

export const mapRestShowToShow = (show: RestShowRecord): ShowModel => ({
  id: show.id,
  name: show.name,
  detail: isPresentString(show.language) ? show.language : null,
  genre: toGenre(show.genreName),
  metric: show.ratingAverage ?? 0,
  tags: [...(show.genres ?? [])].sort((left, right) => left.localeCompare(right)),
});
