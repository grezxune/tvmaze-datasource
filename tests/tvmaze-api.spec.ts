import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TvMazeApi, UpstreamServiceError } from '../src/datasources/tvmaze-api.js';

const baseUrl = 'https://api.example.test';

const rawShow = {
  id: 169,
  name: 'The Expanse',
  language: 'English',
  genres: ['Drama', 'Science-Fiction', 'Thriller'],
  rating: {
    average: 8.3,
  },
};

type FetchMock = ReturnType<typeof vi.fn>;

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });

const getRequestedUrl = (fetchMock: FetchMock): URL => {
  const [url] = fetchMock.mock.calls[0] ?? [];

  if (typeof url !== 'string') {
    throw new Error('Expected fetch to be called with a URL string.');
  }

  return new URL(url);
};

describe('TvMazeApi', () => {
  let fetchMock: FetchMock;
  let api: TvMazeApi;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    api = new TvMazeApi(baseUrl);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('requests the show endpoint by id', async () => {
    fetchMock.mockResolvedValue(jsonResponse(rawShow));

    await expect(api.getShowById('169')).resolves.toEqual({
      id: '169',
      name: 'The Expanse',
      language: 'English',
      genreName: 'Drama',
      ratingAverage: 8.3,
      genres: ['Drama', 'Science-Fiction', 'Thriller'],
    });

    const requestedUrl = getRequestedUrl(fetchMock);
    expect(`${requestedUrl.origin}${requestedUrl.pathname}`).toBe(`${baseUrl}/shows/169`);
  });

  it('URL-encodes the show id path segment', async () => {
    fetchMock.mockResolvedValue(jsonResponse(rawShow));

    await api.getShowById('169/credits');

    const requestedUrl = getRequestedUrl(fetchMock);
    expect(requestedUrl.pathname).toBe('/shows/169%2Fcredits');
  });

  it('maps sparse optional TVmaze fields into a stable record', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        id: 1000,
        name: 'Untitled Show',
      }),
    );

    await expect(api.getShowById('1000')).resolves.toEqual({
      id: '1000',
      name: 'Untitled Show',
      language: undefined,
      genreName: undefined,
      ratingAverage: undefined,
      genres: [],
    });
  });

  it('returns null for a 404 response', async () => {
    fetchMock.mockResolvedValue(new Response('Not found', { status: 404 }));

    await expect(api.getShowById('999999')).resolves.toBeNull();
  });

  it('throws UpstreamServiceError for non-404 upstream failures', async () => {
    fetchMock.mockResolvedValue(new Response('Too many requests', { status: 429 }));

    await expect(api.getShowById('169')).rejects.toBeInstanceOf(UpstreamServiceError);
  });

  it('wraps malformed upstream payloads in UpstreamServiceError', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: '169', name: 'The Expanse' }));

    await expect(api.getShowById('169')).rejects.toBeInstanceOf(UpstreamServiceError);
  });
});
