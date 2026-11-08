# Maintaining the UI Kit

Read this for changes to components, tokens, accessibility, packaging, docs, or release preparation. Start with the issue or product request and the current public contract.

## Change workflow

1. Identify the source implementation, public contract and consumer case. For incoming feedback, use [feedback](feedback.md). Reproduce defects; for a design change state the intended behavior and affected variants. Completion: expected and actual behavior are distinguishable without guessing from a screenshot.
2. Choose the smallest coherent change: usage guidance, composition, existing API, then a new primitive if justified. Changes to system-wide defaults need representative screen comparisons. Completion: decision and acceptance checks are recorded in the task/issue or a linked repo note.
3. Implement in the library. Keep routing, fetching and business state in consumers. Update stories for the changed states and add meaningful regression tests for behavior. Completion: consumers can reach the result through public exports and documented extension points.
4. Verify the affected variants, multiple instances where relevant, keyboard behavior and responsive composition. Use a fixed seed/paused motion for visual comparisons. Run appropriate checks from package.json; packaging/API changes require an installed-package consumer and SSR check. Completion: report actual commands/results and untested cases.
5. Apply the documentation impact table below in the same change. Completion: every affected row is updated or explicitly marked not applicable with a reason in the handoff.
6. For release work, build/inspect the package, test its installation, and follow the agreed release channel. Record consumer retest separately from library verification. Completion: changelog, package identity/version, shipped docs and supported behavior agree; publication is not implied by preparing a release.

## Documentation is part of the change

| Change | Update before completion |
| --- | --- |
| Public prop, export, default or state | Types/implementation, relevant Storybook args and state examples; inventory/usage docs if their instructions change |
| Tokens, density, frames, font or focus behavior | Design guide, representative stories, affected real-screen comparisons |
| Keyboard, semantics or accessibility | Regression evidence and the relevant audit finding; distinguish automated, keyboard and screen-reader checks |
| Ownership, contribution or exception policy | The authoritative using/feedback guide; root AGENTS pointer only if routing changes |
| Supported behavior or release readiness | Relevant usage guidance and release notes; distinguish supported, experimental and untested behavior |
| Package name, version, exports or bundled files | README examples, package metadata, consumer instruction pointer, release/CI fixture paths and packing verification |
| Release or breaking behavior | Release notes/changelog and concrete consumer migration instructions |

Avoid copying full prop tables into multiple prose files; public types and matching Storybook are the API reference. Document reasons, ownership and non-obvious usage constraints in prose. A doc checker can catch missing files/links, not prove that guidance still describes behavior.

## Release and audit evidence

For behavioral fixes, add a regression in `tests/` at the public component boundary; demonstrate failure before the fix and success afterward. Exercise real keyboard/form/browser behavior instead of inspecting source strings, private classes or mocking the component. Keep animation scheduling/pattern checks in the Node suite. Do not add pixel snapshots merely to freeze evolving styling. Run the commands documented in the README before release; browser tests require the matching Playwright Chromium installation. Typecheck includes test files. CI failure artifacts help reproduce failures, but GitHub must separately require the `verify` status check to block merges.

Inspect `npm pack --dry-run --json` for both implementation and the consumer guidance. Check relative README/doc links against shipped files. Never tell a consumer to read an unshipped repository-only path as if it were installed. Derive tarball names from package metadata or packing output when updating automation; do not preserve an obsolete version literal.

Confirm the package identity, version, license, release channel and publication authorization from the current release request and repository configuration. Do not invent a repository URL or perform a release based on a placeholder.

### GitHub release workflow

`.github/workflows/publish.yml` publishes stable versions after a GitHub Release is published. A push or pull request alone does not publish. A manual workflow dispatch runs the full verification and an offline publication dry run without uploading a version to npm. Offline preview allows checking already published versions; it does not test registry authentication or version availability. Prereleases are deliberately excluded from this workflow.

One-time npm setup: in the package's Settings, add a GitHub Actions trusted publisher with user `IgorLo`, repository `svelte-ascii-ui`, and workflow filename `publish.yml`. Leave the optional environment empty and allow direct `npm publish`. This uses OIDC; do not add an npm token secret. Saving the configuration is an account-owner operation and can require interactive authentication. A newly configured publisher must successfully publish within npm's activation window; the dry run does not validate OIDC publication.

Follow [changes and releases](releasing.md) for changelog writing, patch/minor/major decisions, develop accumulation and release PRs and the exact-version human approval gate for major releases. Pending changes are recorded in Changesets files; `CHANGELOG.md` is the source for the GitHub Release body and ships with the package.

For each audit finding record component/state/theme, reproduction, expected/actual result, applicable criterion or design hypothesis, severity, evidence and retest. Check contrast, text resizing, keyboard and focus behavior, target sizes, motion, semantics and responsive composition in relevant states. Resolve release blockers explicitly; report unknowns as untested. Source reviews and old verification files cannot replace a fresh check of a changed behavior.
