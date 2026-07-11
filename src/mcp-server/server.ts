import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { checkFreshness } from "../lib/freshness.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const server = new Server(
  {
    name: "patch-notes-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_tutorial_freshness",
        description: "Checks if a specific claim or code snippet from a tutorial is still fresh / valid against documented facts.",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "The name of the topic / library (e.g. 'React Router v6 Redirects' or 'Next.js App Router Navigation')",
            },
            claim: {
              type: "string",
              description: "The specific coding claim, method call, or function you want to check (e.g., 'Use Redirect component to redirect')",
            },
          },
          required: ["topic", "claim"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "check_tutorial_freshness") {
    throw new Error(`Tool not found: ${request.params.name}`);
  }

  const topic = request.params.arguments?.topic as string;
  const claim = request.params.arguments?.claim as string;

  if (!topic || !claim) {
    return {
      content: [{ type: "text", text: "Error: Both 'topic' and 'claim' are required." }],
      isError: true,
    };
  }

  try {
    const result = await checkFreshness(topic, claim);
    
    // Format the response text beautifully
    let formattedText = `### Freshness Analysis for Topic: ${topic}\n`;
    formattedText += `**Query Claim:** "${claim}"\n\n`;
    formattedText += `**Summary:** ${result.summary}\n`;
    formattedText += `**Overall Compatibility Score:** ${result.compatibilityScore}%\n\n`;
    
    if (result.comparisons && result.comparisons.length > 0) {
      formattedText += `#### Findings:\n`;
      result.comparisons.forEach((comp: any, idx: number) => {
        formattedText += `##### ${idx + 1}. [${comp.severity.toUpperCase()}] ${comp.claim}\n`;
        formattedText += `- **Current Truth:** ${comp.truth}\n`;
        formattedText += `- **Is Outdated?** ${comp.isOutdated ? "Yes ❌" : "No (Current) ✅"}\n`;
        if (comp.explanation) {
          formattedText += `- **Explanation:** ${comp.explanation}\n`;
        }
        if (comp.oldCode) {
          formattedText += `\n\`\`\`typescript\n// Outdated Code:\n${comp.oldCode}\n\`\`\`\n`;
        }
        if (comp.newCode) {
          formattedText += `\n\`\`\`typescript\n// Correct Code:\n${comp.newCode}\n\`\`\`\n`;
        }
        
        if (comp.history && comp.history.length > 0) {
          formattedText += `\n**Evolution History:**\n`;
          comp.history.forEach((hist: any) => {
            formattedText += `- **${hist.date}** (${hist.source}): "${hist.statement}"\n`;
          });
        }
        formattedText += `\n---\n`;
      });
    } else {
      formattedText += `No matching freshness conflicts found. The claim is likely up-to-date.`;
    }

    return {
      content: [{ type: "text", text: formattedText }],
    };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message || error}` }],
      isError: true,
    };
  }
});

// Run server using stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Patch Notes MCP server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running MCP server:", error);
  process.exit(1);
});
