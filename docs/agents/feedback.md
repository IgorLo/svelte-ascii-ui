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

For visual, interaction, accessibility or composition reports, follow [design analysis](design-review.md) to select skills, inspect shared causes and gather evidence before the decision table.

Before implementation, read the relevant issues and comments together, reproduce against the reported version and current code, and separate the user's need from the reporter's proposed implementation. Mark unverified claims and missing evidence explicitly.

Check related components, shared tokens/styles and similar reports before deciding scope. Look for a common cause rather than patching only the named component. A shared cause can justify a system-wide correction; one screenshot does not justify changing unrelated controls. Consistent interaction rules need not produce identical visuals everywhere.

Present a decision table to the user before fixing the batch: issue, evidence/cause, owner (application, documentation, component or system), proposed disposition, affected components and acceptance checks. After approval, implement autonomously within that scope. Return for agreement if new findings materially change scope, public API or visual direction.

Choose the smallest coherent response, including guidance or no library change where appropriate:

| Finding | Disposition |
| --- | --- |
| App layout, copy, wrong props or host CSS | Give a concrete app-level correction; update usage guidance if discovery was difficult |
| Broken supported behavior or accessibility | Fix the primitive and add a regression case |
| Useful capability missing from an existing component | Consider a coherent prop, token or composition pattern; check all affected variants |
| One product-specific need | Keep it in the app using public primitives; document any approved exception |
| Proposed new primitive | Require a real use case, distinct purpose and evidence existing composition is insufficient |
| Unclear or subjective concern | Record the hypothesis and compare in a real workflow before changing global rules |

One consumer can reveal a real bug; a second project is not required to fix it. Equally, one screenshot does not justify changing every component's density. Acceptance of an issue does not oblige the maintainer to implement its suggested solution.

Propose refusals (out of scope, unsupported or intentional behavior) with reasons and a supported alternative where one exists. Obtain the user's agreement before closing without implementation; agreement can be given in the batch decision table. Missing evidence or inability to reproduce alone is not a rejection: state what needs checking.

For an accepted change, follow [maintaining](maintaining.md), including regression coverage, related variants and the original scenario. Record general design decisions in the design guide; keep issue-specific evidence and rationale with the issue. Public guides contain reusable rules, not private consumer context.

## Close after verified integration

Once the agreed solution is implemented, acceptance checks pass and the PR is merged into develop, reply to the issue and close it. Explain the result, link the merged PR and relevant verification, and say: **Fixed in develop; will be included in the next release. Not published yet.** Do not close on a plan, an unmerged PR or while agreed implementation/verification remains incomplete. For documentation changes, describe the guidance added rather than claiming a runtime fix.

A consumer upgrade retest is distinct from kit verification; state any untested consumer outcome without making it a release-dependent closure requirement. No routine follow-up comment after publication is required. Do not promise a version or release date before one is agreed. Closing an issue never authorizes a release; follow [release rules](releasing.md).
