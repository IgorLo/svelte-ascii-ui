# Using the UI Kit in an application

Read this when adopting the package, building an interface with it, diagnosing a visual mismatch, or updating its version.

## Establish the installed contract

1. Identify the installed package name and exact version from the application lockfile/package metadata. Read that version's README, public types and [component inventory](../components.md). Use matching Storybook examples where available. Completion: the implementation and documentation refer to the same version.
2. Import components through the public package entry and the documented CSS/font entries. Start with Theme and its supported settings. Read the [design guide](../design-system.md) before choosing density, typography or composition. Completion: no prototype files or internal package paths are required.
3. Map the requested screen and its loading, empty, error, success and disabled cases onto existing components. Use real text, long values and narrow layouts. Completion: the whole task can be performed, not merely viewed as a static screenshot.

Use the package identity and installation method in the matching README. Pin the exact version while evaluating a prerelease and commit the application lockfile; record each deliberate upgrade.

## Responsibility

| Application owns | UI Kit owns |
| --- | --- |
| Routes, data fetching, persistence, business validation and permissions | Component semantics, keyboard behavior, focus and public state contracts |
| Page width, columns, responsive composition and spacing between page sections | Control geometry, internal padding, frame drawing and supported size variants |
| Product copy, meaningful labels and image alt text | Label/error association mechanisms and status announcement mechanisms |
| Choosing supported props, snippets and theme colors | Supported tokens, typography rules, component states and extension points |
| App-specific compositions and specialist domain widgets | Reusable primitives and patterns supported by actual consumer needs |

Examples: excessive space between two page panels is usually application layout. Excessive padding inside every S button belongs to the kit. A missing accessible label in the app is an app fix; a label that cannot be associated using the component API is a kit issue. A custom palette is allowed, but the app must verify its contrast. A specialist map does not automatically become a UI Kit component.

## When something does not fit

1. Check the installed version, public props, sizing and theme configuration. Isolate host CSS, inherited styles and application wrappers. Completion: distinguish a usage error from a package limitation, or explicitly record uncertainty.
2. If a public prop or app-owned layout solves it, make that change and verify the affected flow. If the cause is inside a component, reproduce it through the public API and follow [feedback](feedback.md).
3. Internal selectors, global overrides targeting kit descendants, component copies and dependency patches are not routine extension points. Request the user's approval for a specific temporary exception with its scope, reason and removal condition. Without approval, leave that part unresolved and continue independent work; do not claim the migration complete.
4. After a library fix, install its released or prerelease package and retest the original application scenario. Completion: the consuming project verifies the fix and any approved workaround is removed or explicitly retained.

## Migration evidence

Record affected routes/tasks, baseline behavior, package version, replacements, deferred cases and approved exceptions. Preserve business behavior unless the user authorizes a product change. Check keyboard navigation, error recovery, long content, supported themes, desktop and mobile layouts. Validate the actual installed package; a successful prototype or Storybook screenshot alone does not establish application compatibility.

## Make this discoverable in a consumer project

Dependency documentation is not automatically loaded by every agent. Add this pointer to the consuming project's own `AGENTS.md` (or its agent instruction file), adapting the package path to the actual installed name:

```md
When building, migrating, debugging or updating UI that uses our ASCII kit,
read node_modules/svelte-ascii-ui/docs/agents/using.md for the installed version.
Follow its ownership and feedback rules; issue publication requires the user's
approval of the complete draft. If dependencies are not installed, locate the
matching package/repository docs before changing kit-specific UI.
```

For pnpm/PnP or a scoped package, resolve the installed package location instead of assuming this example path. Update the pointer when the package is renamed. Keep the rule here authoritative; do not maintain a second copy of the full workflow in every app.
