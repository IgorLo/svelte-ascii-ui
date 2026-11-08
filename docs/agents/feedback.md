# Reporting and deciding UI Kit changes

Read this when an application cannot meet a real requirement through the public API, when a kit defect is suspected, or when reviewing a proposed kit change.

## Consumer agent: draft before publication

1. Follow the ownership diagnosis in [using](using.md). Search the actual kit repository for existing issues when accessible. Completion: identify the likely owner and a related issue, or state that duplicate search could not be performed.
2. Prepare the complete draft below with a minimal public-API reproduction. Show it to the user, including why an app-level solution is or is not appropriate. Completion: the user can decide whether to accept the current behavior, change the app, approve a temporary exception, or request a kit change.
3. **Publish only after the user approves that specific draft and destination.** Permission to prepare an issue is not permission to publish it. If substantive scope changes, present the revised draft.
4. Include only approved, shareable evidence. Inspect screenshots, logs and reproductions for personal data and secrets. If publishing is unavailable, save the draft in the consumer repository and give its path; do not claim an issue exists.

## Issue draft template

```md
Title: [Component / pattern] Observable problem in a concrete scenario

Type: defect / missing capability / design question
Consumer project and user task:
Package name and exact version:
Component, size, theme, relevant props:
Browser / OS / viewport / input method:

Expected result and why it matters:
Actual result and practical impact:
Steps to reproduce:
Minimal example using public exports:
Screenshot or recording (same configuration; pause/seed animations):

Diagnosis:
- Public options and app-level fixes tried:
- Why the remaining problem belongs to the kit (or what is uncertain):
- Related issue / duplicate search result:
- Existing workaround or explicit statement that none was introduced:

Proposed acceptance checks:
Affected variants and possible regressions:
Severity and evidence (distinguish measurement from preference):
Suggested direction, if any; not a predetermined implementation:
```

Missing evidence must be marked unknown, not invented. A source standard is needed for a claimed standards failure; a visual preference is valid feedback without pretending to be one.

## Kit maintainer: choose a disposition

Reproduce against the reported version and current code before choosing:

| Finding | Disposition |
| --- | --- |
| App layout, copy, wrong props or host CSS | Give a concrete app-level correction; update usage guidance if discovery was difficult |
| Broken supported behavior or accessibility | Fix the primitive and add a regression case |
| Useful capability missing from an existing component | Consider a coherent prop, token or composition pattern; check all affected variants |
| One product-specific need | Keep it in the app using public primitives; document any approved exception |
| Proposed new primitive | Require a real use case, distinct purpose and evidence existing composition is insufficient |
| Unclear or subjective concern | Record the hypothesis and compare in a real workflow before changing global rules |

One consumer can reveal a real bug; a second project is not required to fix it. Equally, one screenshot does not justify changing every component's density. Acceptance of an issue does not oblige the maintainer to implement its suggested solution.

For an accepted change, follow [maintaining](maintaining.md). Link the regression story/test and release version back to the report. A merged fix and a verified consumer upgrade are separate outcomes: close the loop by retesting the original consuming flow, not just the component demo. Any closure comment or other external write must be within the user's authorization.
