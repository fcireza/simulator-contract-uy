# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Creating a pull request, opening a PR, or preparing changes for review | branch-pr | /Users/federico/.config/opencode/skills/branch-pr/SKILL.md |
| PR would exceed 400 changed lines, planning chained PRs, stacked PRs, or reviewable slices | chained-pr | /Users/federico/.config/opencode/skills/chained-pr/SKILL.md |
| Writing guides, READMEs, RFCs, onboarding docs, architecture docs, or review-facing documentation | cognitive-doc-design | /Users/federico/.config/opencode/skills/cognitive-doc-design/SKILL.md |
| Drafting or posting feedback, review comments, maintainer replies, Slack messages, or GitHub comments | comment-writer | /Users/federico/.config/opencode/skills/comment-writer/SKILL.md |
| Writing Go tests, using teatest, or adding test coverage | go-testing | /Users/federico/.config/opencode/skills/go-testing/SKILL.md |
| Creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /Users/federico/.config/opencode/skills/issue-creation/SKILL.md |
| "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | /Users/federico/.config/opencode/skills/judgment-day/SKILL.md |
| Creating a new skill, adding agent instructions, or documenting patterns for AI | skill-creator | /Users/federico/.config/opencode/skills/skill-creator/SKILL.md |
| Implementing a change, preparing commits, splitting PRs, or planning chained or stacked PRs | work-unit-commits | /Users/federico/.config/opencode/skills/work-unit-commits/SKILL.md |
| Building web components, pages, artifacts, posters, or applications; styling/beautifying any web UI | frontend-design | /Users/federico/dev/GitHub/My/simulator-contract-uy/.agents/skills/frontend-design/SKILL.md |
| UI structure, visual design decisions, interaction patterns, or user experience quality control | ui-ux-pro-max | /Users/federico/dev/GitHub/My/simulator-contract-uy/.agents/skills/ui-ux-pro-max/SKILL.md |
| Creating component libraries, implementing design systems, or standardizing UI patterns with Tailwind | tailwind-design-system | /Users/federico/dev/GitHub/My/simulator-contract-uy/.agents/skills/tailwind-design-system/SKILL.md |
| Writing or reviewing Next.js code (file conventions, RSC boundaries, data patterns) | next-best-practices | /Users/federico/dev/GitHub/My/simulator-contract-uy/.agents/skills/next-best-practices/SKILL.md |
| Next.js App Router, routing, Server Components, Server Actions, layouts, middleware | nextjs | /Users/federico/dev/GitHub/My/simulator-contract-uy/.agents/skills/nextjs/SKILL.md |
| React/Next.js performance, eliminating waterfalls, bundle optimization | vercel-react-best-practices | /Users/federico/.config/opencode/skills/vercel-react-best-practices/SKILL.md |
| Finding or discovering skills, "how do I do X", "is there a skill that can..." | find-skills | /Users/federico/.config/opencode/skills/find-skills/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue (Closes/Fixes/Resolves #N) — no exceptions
- Every PR MUST have exactly one `type:*` label (bug, feature, docs, refactor, chore, breaking-change)
- Branch names MUST match: `(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)/[a-z0-9._-]+$`
- Commit messages MUST follow Conventional Commits: `type(scope): description`
- Run shellcheck on modified scripts before pushing
- All automated checks must pass before merge is possible
- PR body must include: linked issue, PR type checkbox, summary, changes table, test plan, contributor checklist

### chained-pr
- MUST split when a PR exceeds 400 changed lines (additions + deletions) unless maintainer-approved `size:exception`
- Design each PR for ≤60-minute human review
- Every chained PR MUST state start, end, before, after, and out of scope
- Each PR must be autonomous: understandable and verifiable alone, green CI, clear rollback
- One deliverable work unit per PR; do not mix unrelated changes
- Every PR MUST include a dependency diagram marking the current PR with 📍
- For Feature Branch Chain: PR #1 targets tracker branch; later PRs target immediate parent branch
- If a child PR shows previous PR changes, retarget/rebase until diff is clean
- Keep the tracker branch as draft/no-merge until the chain is complete

### cognitive-doc-design
- Lead with the answer — decision, action, or outcome first; context comes after
- Progressive disclosure: happy path first, then details, edge cases, references
- Chunking: group related information into small sections; keep flat lists short
- Signposting: use headings, labels, callouts, and summaries so readers know where they are
- Recognition over recall: prefer tables, checklists, examples, and templates over prose
- For PR docs: state what to review first, what is intentionally out of scope, link previous/next PR
- Use checklists for acceptance criteria and verification

### comment-writer
- Be useful fast: start with the actionable point, don't recap the whole PR first
- Be warm and direct: sound like a thoughtful teammate, not a corporate bot
- Keep it short: 1-3 short paragraphs or a tight bullet list
- Explain WHY when asking for a change
- Avoid pile-ons: comment on the highest-value issue, not every tiny preference
- Match thread language (Spanish → Rioplatense voseo: podés, tenés, fijate, dale)
- No em dashes — use commas, periods, or parentheses instead
- Formula: <Direct observation> + <Why it matters> + <Concrete next action>

### go-testing
- Use table-driven tests for pure functions: `[]struct{name, input, expected, wantErr}` with `t.Run`
- Test both success and error cases for functions that return errors
- For Bubbletea TUI: test Model.Update() directly for state changes
- For full TUI flows: use `teatest.NewTestModel(t, m)` with `tm.Send()` and `tm.WaitFinished()`
- Use golden file testing for visual output: compare against saved `.golden` files
- Mock dependencies via interfaces; use `t.TempDir()` for file operations
- Organization: `model_test.go`, `update_test.go`, `view_test.go` beside source files
- Commands: `go test ./...`, `go test -cover ./...`, `go test -update ./...` (golden)

### issue-creation
- Blank issues are disabled — MUST use a template (Bug Report or Feature Request)
- Every issue gets `status:needs-review` automatically on creation
- A maintainer MUST add `status:approved` before any PR can be opened
- Questions go to Discussions, not issues
- Search for duplicates before creating
- Bug Report template auto-labels: `bug`, `status:needs-review`
- Feature Request template auto-labels: `enhancement`, `status:needs-review`
- Issue body must include: pre-flight checks, description, steps to reproduce (bug) or problem + proposed solution (feature)

### judgment-day
- Launch TWO sub-agents via `delegate` (async, parallel) — NEVER sequential
- Each agent receives same target but works independently — no cross-contamination
- Orchestrator NEVER reviews code itself — only coordinates, reads results, synthesizes
- WARNING classification: real = normal user can trigger; theoretical = requires contrived scenario → report as INFO
- Round 1: present verdict table, ASK user to fix before proceeding
- Round 2+: only re-judge for confirmed CRITICALs; fix real WARNINGs inline without re-judge
- APPROVED criteria: 0 confirmed CRITICALs + 0 confirmed real WARNINGs
- After 2 fix iterations, ASK user before continuing — never escalate automatically
- Inject identical Project Standards block into BOTH Judge prompts AND Fix Agent prompt

### skill-creator
- Create a skill when: pattern repeats, project conventions differ, complex workflows need step-by-step instructions
- Don't create when: documentation already exists, pattern is trivial, it's a one-off task
- Structure: `skills/{name}/SKILL.md` (required), optional `assets/` for templates, `references/` for local docs
- Frontmatter required: name, description (with trigger), license (Apache-2.0), metadata.author, metadata.version
- DO: start with critical patterns, use tables for decision trees, keep examples minimal, include Commands section
- DON'T: add Keywords section, duplicate existing docs, include lengthy explanations, use web URLs in references
- `references/` should point to LOCAL files, not web URLs
- Register skill in AGENTS.md after creation

### work-unit-commits
- A commit represents a deliverable behavior, fix, migration, or docs unit — NOT a file type
- Avoid separate commits for `models`, `services`, `tests` if none works alone
- Tests belong in the SAME commit as the behavior they verify
- Docs belong with the user-visible change they explain
- Reviewer should understand why each commit exists from its diff and message
- Each commit should be a candidate for a chained PR when the change grows
- If SDD tasks forecast >400-line change, group commits into chained PR slices before implementation
- Confirm: one clear purpose, repo makes sense after applying, tests/docs included, rollback is reasonable

### frontend-design
- Commit to a BOLD aesthetic direction: purpose, tone (pick an extreme), constraints, differentiation
- Typography: choose distinctive fonts — avoid Inter, Roboto, Arial, system fonts; pair display + body fonts
- Color & Theme: use CSS variables for consistency; dominant colors with sharp accents over timid palettes
- Motion: prioritize CSS-only solutions; one well-orchestrated page load > scattered micro-interactions
- Spatial Composition: unexpected layouts, asymmetry, overlap, diagonal flow, generous negative space OR controlled density
- Backgrounds: create atmosphere with gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows
- NEVER use generic AI aesthetics: purple gradients on white, predictable layouts, cookie-cutter design
- Match complexity to vision: maximalist needs elaborate code; minimalist needs restraint and precision

### ui-ux-pro-max
- Accessibility: contrast ≥4.5:1, visible focus rings (2-4px), ARIA labels, keyboard nav, skip links, heading hierarchy
- Touch: min target 44×44pt (iOS) / 48×48dp (Material), 8px+ spacing, loading feedback, disable button during async
- No emoji as icons — use SVG (Heroicons, Lucide); one icon set per visual language
- Spacing: use 4pt/8dp incremental system; mobile-first breakpoints; no horizontal scroll
- Typography: base 16px body, line-height 1.5-1.75, weight hierarchy (bold headings 600-700, regular 400)
- Animation: 150-300ms for micro-interactions; transform/opacity only; respect prefers-reduced-motion
- Forms: visible labels (not placeholder-only), errors below field, inline validation on blur
- Charts: match type to data, accessible colors, tooltips on hover/tap, legends visible, table alternative for a11y
- Dark mode: desaturated/lighter tonal variants (not inverted); test contrast separately
- Press feedback within 80-150ms; cursor-pointer on clickable elements

### tailwind-design-system
- Tailwind v4: uses CSS-first config with `@import "tailwindcss"` and `@theme` (no tailwind.config.ts)
- v4 `@theme` replaces `tailwind.config.ts`; `@tailwind base/components/utilities` replaced by `@import "tailwindcss"`
- v4 dark mode: `@custom-variant dark (&:where(.dark, .dark *))` replaces `darkMode: "class"`
- Design token hierarchy: Brand → Semantic → Component (e.g., oklch value → --color-primary → bg-primary)
- Component architecture: Base styles → Variants → Sizes → States → Overrides
- Use CVA (Class Variance Authority) for component variants with TypeScript
- React 19: ref is a regular prop — no forwardRef needed
- Use `cn()` utility (clsx + twMerge) for conditional class merging
- OKLCH colors for better perception; use `color-mix()` for alpha/semi-transparent variants

### next-best-practices
- Default to Node.js runtime; use Edge only when justified (low-latency, no Node APIs)
- Server Actions vs Route Handlers: Route Handlers for API endpoints, Server Actions for form mutations
- Avoid data waterfalls: use `Promise.all`, Suspense, or preload patterns
- Always use `next/image` over `<img>`; configure remotePatterns for external images
- Use `next/font` for Google/local fonts with automatic self-hosting and zero layout shift
- `'use client'` only for interactivity/hooks/effects; default to Server Components
- `generateMetadata` for dynamic metadata; export static metadata object for pages
- Error files: `error.tsx` (recovery), `global-error.tsx` (full reset), `not-found.tsx`
- Route Handlers: no React DOM available; GET conflicts with `page.tsx` in same route
- `useSearchParams` and `usePathname` trigger CSR bailout — wrap in Suspense boundary

### nextjs
- App Router is default; prefer it over Pages Router
- Server Components by default — add 'use client' only for interactivity/hooks/effects
- Route handlers: use for API endpoints, not for UI
- Server Actions: use for form mutations and data modifications
- Cache: understand `fetch` cache, route segment cache, and static/dynamic rendering
- Metadata: use `generateMetadata` for dynamic, export `metadata` object for static
- Images: always use `next/image`, configure `remotePatterns` for external domains
- Fonts: use `next/font` for automatic optimization and zero layout shift

### vercel-react-best-practices
- Eliminate waterfalls: check cheap conditions before await, defer await to branches, use Promise.all for independent ops
- Bundle optimization: import directly from packages, avoid barrel files (`index.ts`), use statically analyzable paths
- Server-side: fetch early, streaming with Suspense, use `React.cache()` for deduplication
- Client data: prefer server components, use Suspense for loading states, avoid useEffect for data fetching
- Re-renders: memoize expensive computations, use proper key strategy, avoid prop drilling
- Prefer native React features (use(), useOptimistic, useActionState) over custom solutions

### find-skills
- Search across ALL skill directories: `~/.config/opencode/skills/`, `~/.claude/skills/`, `.agents/skills/`, etc.
- Match by code context: file extensions and paths the task will touch
- Match by task context: what the user is asking to do (review, create PR, write tests, etc.)
- If skill exists, load it; if not, warn user and proceed with generic patterns
- Project-level skills override user-level with same name (e.g., frontend-design)
- Skip sdd-*, _shared, and skill-registry when scanning

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| next-best-practices | .agents/skills/next-best-practices/SKILL.md | Project-level Next.js conventions |
| nextjs | .agents/skills/nextjs/SKILL.md | Upstream Next.js reference |
| tailwind-design-system | .agents/skills/tailwind-design-system/SKILL.md | Tailwind v4 design system patterns |
| ui-ux-pro-max | .agents/skills/ui-ux-pro-max/SKILL.md | UI/UX design intelligence database |
| frontend-design | .agents/skills/frontend-design/SKILL.md | Project-level frontend design |