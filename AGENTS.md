<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Component Architecture & Shared Components Rule

Always prioritize the reuse and creation of shared components over inline or page-specific implementations whenever possible.

### 1. Prioritize Reuse Before Creating
- Before writing any new UI element or widget, inspect existing components in `@/components/` (e.g., `@/components/ui/`, `@/components/shared/`, `@/components/common/`).
- If an existing component satisfies the requirement or can be easily extended via props or composition, reuse it instead of duplicating code.

### 2. Prioritize Creating Shared Components
- Whenever a required UI pattern does not exist yet, build it as a reusable shared component in the `@/components/` directory rather than defining single-use, inline, or page-local components.
- Group components logically:
  - Base / Primitive UI elements (buttons, inputs, dialogs, cards, badges, dropdowns, tables) -> `@/components/ui/`
  - Domain-agnostic composite widgets or layout structures -> `@/components/shared/` or `@/components/layout/`
- Only create route-specific or private components if the component is deeply tied to a single route's unique lifecycle/state and cannot reasonably be generalized.

### 3. Shared Component Standards
- **Modularity & Composition**: Design components to be flexible, composable, and cleanly typed with TypeScript interfaces.
- **Styling**: Support standard styling extension (e.g., accept `className` and merge properly using Tailwind CSS).
- **Separation of Concerns**: Keep presentation components decoupled from route-specific data fetching or business logic—pass handlers, data, and children via props.
- **Accessibility & Consistency**: Ensure proper ARIA attributes, semantic HTML, and consistent states (hover, focus, disabled, loading).

