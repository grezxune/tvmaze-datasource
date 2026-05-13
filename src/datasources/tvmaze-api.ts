import { z } from 'zod';

const RawShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  language: z.string().optional().nullable(),
  genres: z.array(z.string()).optional().nullable(),
  rating: z
    .object({
      average: z.number().nullable(),
    })
    .optional()
    .nullable(),
});

type RawShow = z.infer<typeof RawShowSchema>;

export interface RestShowRecord {
  id: string;
  name: string;
  language: string | null | undefined;
  genreName: string | null | undefined;
  ratingAverage: number | null | undefined;
  genres: string[];
}

const toRecord = (show: RawShow): RestShowRecord => ({
  id: String(show.id),
  name: show.name,
  language: show.language,
  genreName: show.genres?.[0],
  ratingAverage: show.rating?.average,
  genres: show.genres ?? [],
});

const parseOne = (body: unknown): RestShowRecord => toRecord(RawShowSchema.parse(body));

export interface TvMazeApiContract {
  getShowById(id: string): Promise<RestShowRecord | null>;
}

export class UpstreamServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamServiceError';
  }
}

export class TvMazeApi implements TvMazeApiContract {
  constructor(private readonly baseUrl: string) {}

  async getShowById(_id: string): Promise<RestShowRecord | null> {
    // TODO: Implement the TVmaze datasource.
    //
    // Expected behavior:
    // - request `${baseUrl}/shows/{id}` and URL-encode the path segment
    // - return null for a 404 response
    // - throw UpstreamServiceError for other non-2xx responses
    // - parse the JSON body with RawShowSchema
    // - map the raw payload into RestShowRecord with parseOne
    // - wrap payload parsing failures in UpstreamServiceError
    void parseOne;

    throw new Error('TODO: implement TvMazeApi.getShowById');
  }
}
