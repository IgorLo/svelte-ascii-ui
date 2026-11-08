# Design analysis for UI issues

Use this before choosing an implementation for a visual, interaction, accessibility or composition issue. [Feedback](feedback.md) owns decision approval and closure; [maintaining](maintaining.md) owns implementation and verification. This guide defines the analysis between them.

## 1. Frame the task and evidence

Read the issue, comments, related reports and design-system contract. State the user task, observed obstacle, affected component/states, exact reported version and current revision. Separate the request from its proposed solution. Reproduce with public library components and inspect the real composition when available. Completion: each claim is observed, source-confirmed or explicitly unverified; missing evidence is not a reason to reject the need.

## 2. Choose the review tools

Read the applicable installed skill before using it. Skills assist the method; they are not package dependencies. If absent, perform the checks described here and report the missing coverage rather than requiring consumers to install personal skills.

| Question | Relevant skill | Expected evidence |
| --- | --- | --- |
| Several connected visual concerns or an entire screen | better-interface | One ranked report across its six design domains |
| Keyboard, semantics, focus, touch targets or assistive technology | better-accessibility | Actual interactions, accessible names/roles/states and applicable criteria |
| Surfaces, semantic colors, transparency or contrast | better-colors | Role map and measured rendered foreground/background pairs |
| Hover, pressed states, icon alignment or motion | better-ui | State comparison, pointer and reduced-motion behavior |
| Grouping, density, wrapping or narrow layouts | better-layout | Representative compositions at supported widths, overflow and target spacing |
| Font metrics, text scale or numeric readability | better-typography | Computed typography, real long/localized text and resizing |
| Labels, hints, errors or ambiguous status | better-writing | Wording in context, action and recovery meaning |
| An uncertain criterion or design precedent | research | Primary sources tied to the decision, with limits of applicability |
| A reproducible behavioral defect or regression | diagnosing-bugs | A repeatable check that detects the reported failure |
| Alternatives cannot be settled by inspection | prototype | A clearly temporary comparison answering one explicit question |
| An unresolved product/design choice | grilling | A recommendation and a bounded question for the human |
| Public behavior needs regression protection | tdd | Tests at the public interface, not frozen implementation details |
| A completed change needs review | code-review | Agreed diff base and review against both rules and accepted scope |
| Agent-facing process documentation changes | writing-for-agents | One authoritative procedure with clear entry and completion conditions |

Use only the relevant domain skills for a focused issue. A broad interface review covers every domain required by better-interface, or names the gaps. Do not run a whole-site audit for a single local concern.

## 3. Inspect the surrounding system

Map shared tokens, styles, state rules and sibling components. Inspect the original scenario plus representative neighboring states: ready/hover/focus/pressed, selected/invalid, disabled/read-only/loading as applicable. Include S/M/L where supported, built-in palettes and a representative custom font/theme, narrow layout, keyboard and touch. Add forced-colors, reduced-motion or zoom checks when the behavior can be affected. Completion: the likely root cause and confirmed affected locations are named; untested combinations remain explicit.

Look for adjacent problems exposed by the scenario, including semantic misuse, unclear primary actions, color-only status, excessive nested frames, clipping and inaccessible help. Record each separately with its owner and evidence. Do not silently expand the agreed implementation scope.

## 4. Research only what affects a decision

When behavior, a standard or an approach is uncertain, use current primary sources: the actual specification and official component documentation/source. Compare one or two relevant systems when their interaction or API choices can resolve a question. State what transfers to this kit and what does not. More articles are not a completion criterion.

Separate normative requirements, documented kit contracts, external heuristics and visual preferences. Verify claimed accessibility thresholds and exceptions against the relevant criterion; APG patterns and another kit's defaults are not blanket compliance rules. Preserve the kit's deliberate ASCII geometry, density and visual language. A skill's generic shadow, fill, font or animation recipe is not automatic authorization to redesign them.

For each unresolved issue compare the smallest coherent options, including keeping current behavior with better guidance. Add a token, prop or component only for a demonstrated responsibility the existing public API or composition cannot express. Consistency means a coherent rule, not identical styling everywhere.

## 5. Deliver a decision, not a list of links

Present one table: issue/user obstacle, evidence and uncertainty, root cause and owner, related components, recommended disposition and alternatives, expected benefit, compatibility risks and acceptance checks. Group shared causes while retaining a disposition for every issue. Rank by user impact and reach, not by how many screenshots exist. Label hypotheses separately from confirmed defects.

Research is sufficient when it supports a choice and a reproducible acceptance check, or identifies the specific missing evidence. Follow feedback.md for approval before implementation or refusal. If a visual choice remains unresolved, propose a small comparison rather than changing the global default by guesswork.

## 6. Keep the durable result in the right place

Keep private research, screenshots, integration-specific notes and exploratory scripts in ignored local files. The public design guide records accepted reusable rules; stories demonstrate supported states and compositions; tests protect behavior. Issue/PR discussion contains only approved shareable evidence and rationale. Do not publish private project names or research dumps in the package.

After approval, implement through the maintenance/release workflows, retest the original case and affected family, and add a changeset. Use the agreed closure procedure after verified merge into develop. Neither analysis, approval to fix, nor merge authorizes a release.
