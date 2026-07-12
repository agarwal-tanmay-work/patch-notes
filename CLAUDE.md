# Patch Notes Developer Guide (CLAUDE.md)

This guide provides shortcuts, build commands, and rules for agents and developers working on the Patch Notes repository.

## Commands

- **Start Dev Server**: `npm run dev` (Runs `next dev --webpack` to avoid Windows folder-scanning hangs)
- **Production Build**: `npm run build`
- **Production Start**: `npm start`
- **Lint Code**: `npm run lint`
- **Test MCP Server**: `npx tsx scratch/test-mcp.ts` (Sends tool request over stdin to verify local Supermemory indexing)

## Architecture Overview

- **Frontend**: Next.js 16 (App Router) using Webpack.
- **Styling**: Vanilla TailwindCSS 4, configured with an approachable grayscale theme (neutral white/charcoal backgrounds, `#333333` borders) and a single `#d37bff` purple accent.
- **Database**: Local self-hosted Supermemory container (`supermemory-local` running on port 6767).
- **Core LLM**: Gemini 2.5 Flash (`gemini-2.5-flash`) for provenance matching and compatibility score generation.
- **MCP Server**: Stdio JSON-RPC model tool integration defined in `src/mcp-server/server.ts`.

## Code Guidelines

- **Types**: Always maintain strict TypeScript type safety. Use type assertions (`as const`) for Framer Motion variant transitions.
- **Styling**: Avoid colored backgrounds on cards or chrome. Keep them neutral gray or white. Reserve `#fcab83` (salmon) and `#9ef58f` (green) *exclusively* for outdated/current comparison states.
- **Imports**: Use absolute path aliases (e.g. `@/lib/freshness`) for imports.
- **No Emojis in UI**: Do not add emojis to general UI chrome. Emojis are reserved only for console logging or markdown reporting metadata.
