# Patch Notes - Agent Behavior Guidelines (AGENTS.md)

This file contains behavioral instructions and codebase rules that coding assistants must follow when editing this repository.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 Rules

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Development Constraints

1. **Webpack Compilation**:
   Always run Next.js in dev mode using Webpack (`npx next dev --webpack` or `npm run dev`) on Windows. Avoid Turbopack folder-scanning tracing which hangs the compiler engine.

2. **Strict Grayscale Styling**:
   - Backgrounds must remain neutral white/grayscale.
   - Outlines and borders must use dark charcoal `#333333`.
   - The primary brand accent color is `#d37bff` (purple).
   - Reserve `#fcab83` (salmon) and `#9ef58f` (green) *only* for displaying "outdated claims" versus "current truths". Do not use them elsewhere in the UI.

3. **No Emojis in Web UI**:
   Do not introduce emojis into the web application's layout chrome, navigation, headers, or buttons. Emojis may only be used inside console logging, terminal scripts, or generated markdown files.

4. **Typescript Casting**:
   When using Framer Motion animation properties (such as `type: "spring"`), always append type assertions (`as const`) to satisfy TypeScript union type rules.

5. **Local Data Isolation**:
   Do not commit private credentials, local database files, or `.env.local` keys to version control.
