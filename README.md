# TypeScript + GraphQL Datasource Exercise

## Overview

You are joining a small GraphQL service backed by the public [TVmaze API](https://www.tvmaze.com/api). The GraphQL schema, mapper, resolver, and server wiring are already in place. Your main job is to complete the datasource that talks to TVmaze.

TVmaze was selected because its public API documentation covers endpoint shapes, rate limiting, caching, CORS, licensing, and change history.

## Timebox

This exercise is designed to take roughly **25 to 35 minutes** for a strong candidate.

## What You Are Building

The service exposes:

- `show(id: ID!): ShowLookupResult!`

The public `Show` type stays intentionally small:

- `id`
- `name`
- `detail`
- `tags`
- `summary`

Use this REST API base URL:

```text
https://api.tvmaze.com
```

## Your Task

Make the supplied tests pass by completing:

- `src/datasources/tvmaze-api.ts`

You should not need to rewrite the GraphQL resolver or mapper. They are implemented to keep the exercise centered on the datasource boundary.

## Functional Requirements

### `TvMazeApi.getShowById(id)`

Implement the datasource method with the following behavior:

- Call the TVmaze `/shows/{id}` endpoint.
- URL-encode the show id path segment.
- Return `null` for a 404 response.
- Throw `UpstreamServiceError` for other non-2xx responses.
- Validate the JSON payload with the provided Zod schema.
- Convert the raw TVmaze payload into the provided `RestShowRecord` shape.
- Wrap malformed upstream payloads in `UpstreamServiceError`.

## How To Run

```bash
pnpm install
pnpm test
pnpm run typecheck
```

## Submission Guidance

Please leave the project in a runnable state where:

- `pnpm test` completes successfully
- `pnpm run typecheck` succeeds

If you make assumptions, note them briefly in code comments or in a short written note.
