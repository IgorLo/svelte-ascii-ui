# UI Kit repository rules

Work from the current issue, code and product request. Public documentation describes the library's supported contracts and contribution process.

- For component, token, accessibility or public API changes, follow `docs/agents/maintaining.md`, including the temporary diff-demo for visual approval and its documentation impact checklist before declaring completion.
- For use in another project, follow `docs/agents/using.md`. It defines application vs library ownership and the consumer-project instruction to install.
- For incoming issue triage, closure, a bug, missing capability or proposed exception, follow `docs/agents/feedback.md`. **Show the user the complete issue draft and obtain approval before publishing it.** Approval to report a problem does not approve a workaround or a library redesign.
- For design-related issues and audits, follow `docs/agents/design-review.md` for evidence, skill selection and research before proposing fixes.
- For visual decisions, use `docs/design-system.md`. For audits, record the applicable criterion, reproducible evidence and untested cases alongside each finding.
- For changes, Changesets, version selection, changelog entries or releases, follow `docs/agents/releasing.md`. Branch from develop and target develop for ordinary task PRs; promote a batch to main only through an authorized release PR. Release preparation, version bumps, tags and publication each require an explicit human release request; permission to merge is not release permission. Major version increases require the human's explicit approval; a general request to publish is not approval for a major bump.

`src/lib` and its public exports are the reusable implementation. Storybook and `src/Gallery.svelte` exercise those same components. Keep component behavior and styling in the library; gallery CSS owns only page composition. Temporary visual experiments must be removed after their accepted decisions are implemented and documented.

Use the public API, documented theme settings and composition for integrations. Internal style overrides, copied components and patches to installed dependencies require the user's explicit approval for the particular exception; prepare the feedback draft instead of silently introducing them.

At handoff, report code, story/test and documentation changes together, commands actually run, remaining uncertainty, and any open consumer retest. Existing verification reports describe past runs, not current proof. Update the relevant authoritative document when a decision changes; link to it rather than copying its rules into another file.

Keep personal plans, session notes, internal research and consumer-specific migration context out of public documentation and package contents. Publish only library-relevant guidance and shareable evidence approved for the issue.

Preserve development history: make a descriptive Git commit after each completed, verified logical change. Inspect the staged diff before committing; include only the task's changes and never local notes, credentials or generated artifacts. Report the commit hash and actual verification at handoff. Do not amend or rewrite existing history unless explicitly requested. Commit locally even when remote authentication is unavailable; push when authorized by the current request.

## Shared conventions

For software projects, resolve the current main commit of https://github.com/IgorLo/igorlo-llm-hub at the start of each task. Read AGENTS.md and its task-relevant links at that exact commit. Keep this revision for the task. If offline, use the last available approved revision and state its SHA; if none is available, say so and use project instructions. Follow project-specific contracts and release rules.
