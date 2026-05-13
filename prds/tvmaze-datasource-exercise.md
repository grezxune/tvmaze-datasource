---
title: TVmaze Datasource Exercise
created: 2026-05-13
owner: Tommy
log:
  - 2026-05-13: Initial requirements documented for datasource-focused TVmaze exercise.
---

## Problem

The TVmaze exercise needs a variant where the main evaluation signal is implementing a REST datasource boundary rather than resolver and mapper wiring.

## Business Context

This short exercise assesses TypeScript backend judgment around HTTP status handling, payload validation, and typed error translation.

## Goals & KPIs

- Candidate work is concentrated in `src/datasources/tvmaze-api.ts`.
- Resolver and mapper tests pass without candidate changes.
- Datasource tests fail before implementation and pass after the expected implementation.

## Personas/Journeys

Candidate: reads the README, installs dependencies with bun, runs tests, implements the datasource, reruns tests and typecheck.

Reviewer: inspects the datasource implementation and test results for edge-case handling and clarity.

## Functional Requirements

- Provide a working Apollo Server scaffold.
- Provide implemented show mapper and resolver logic.
- Leave `TvMazeApi.getShowById` as the primary TODO.
- Test endpoint URL construction, URL encoding, 404 handling, upstream errors, and malformed payload handling.

## Non-functional Requirements

- TypeScript strict mode remains enabled.
- Tests mock `fetch` and do not require live network access.
- Files remain small and readable.

## Data & Integrations

The runtime datasource calls `https://api.tvmaze.com/shows/{id}`.

## Security Architecture & Threat Model

Trust boundary: show id input crosses from GraphQL into the datasource and then to the upstream TVmaze API. The datasource must URL-encode path input, validate upstream JSON, and avoid exposing raw upstream payloads in GraphQL errors.

## Performance Strategy & Budgets

The GraphQL `show` query should perform one upstream request. Runtime behavior should avoid retry loops or extra requests in the exercise path.

## Open Questions

- None for the initial version.

## Risks & Mitigations

Risk: candidates rewrite resolver code.

Mitigation: resolver and mapper are complete, tested, and documented as out of scope.

## Success Metrics

- `bun run typecheck` succeeds.
- Full tests fail only on the datasource TODO before implementation.
- Full tests pass after a correct datasource implementation.

## Rollout Plan

Publish `tvmaze-datasource/new` as the standalone candidate repository and keep `tvmaze-datasource/complete` local only.

## Next Steps

- Initialize and push the candidate repository.
