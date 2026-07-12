# Patch Notes 📝

Keep your coding tutorials and StackOverflow claims up-to-date against modern documentation.

---

## 🚀 Overview

Many developer tutorials, guides, and StackOverflow answers become outdated as libraries release breaking changes. Patch Notes solves this by ingesting both tutorial media (videos/urls) and official docs into a local semantic graph database. It compares video claims with current docs, highlighting obsolete APIs, deprecated functions, and code syntax changes side-by-side.

---

## 🧠 How this uses Supermemory Local

Patch Notes relies on a self-hosted **Supermemory Local** server instance running containerized on port 6767 for all core indexing, vector embedding storage, and query retrieval. During ingestion, tutorial transcriptions and official markdown documents are loaded natively into a unified Supermemory graph index scoped under a slugified `containerTag` per topic. Rather than performing a standard text diff, Patch Notes queries Supermemory's hybrid retrieval system to extract historical claims and uses its metadata scoping to determine the current, contradiction-resolved truth. Additionally, the entire freshness checking pipeline is exposed as a Model Context Protocol (MCP) server, allowing external coding assistants to query the local Supermemory facts directly.

---

## 🛠️ Windows & Docker Architecture

The official Supermemory local installation script requires a native Linux shell environment, and WSL bash was not available for native CLI installation in this environment. As an engineering decision to maintain complete local data sovereignty on Windows, we run the authentic pre-compiled Linux binary (`supermemory-server-linux-x64`) inside a Debian-based Docker container. This allows the Next.js SDK client to communicate with the real self-hosted Supermemory engine over standard TCP port 6767.

---

## 📦 Setup & Installation

### 1. Start Supermemory Local (Docker)

Start the pre-built `supermemory-local` container on port 6767:
```bash
docker start supermemory-server
```
*(If starting from scratch)*:
```bash
docker run -d --name supermemory-server -p 6767:6767 -v supermemory-data:/root/.supermemory -e GEMINI_API_KEY="your_api_key_here" supermemory-local
```

### 2. Install Project Dependencies
```bash
cd patch-notes
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project:
```env
SUPERMEMORY_API_KEY=sm_jnNpbt8zsALUqAJpyZZYd1_vZoQdujWsl7sINc7Dqx2sIm5F63B6VHIRi73ZOOSHJmdxHsw5UFfZNWQ0j9Np12U
SUPERMEMORY_BASE_URL=http://localhost:6767
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Web App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the interactive timeline and claims relationship graph.

---

## 🔌 Connecting the MCP Server

You can query Patch Notes' facts directly inside your favorite AI coding assistant.

### Antigravity Config (`C:\Users\priya\.gemini\config\mcp_config.json`)
```json
{
  "mcpServers": {
    "patch-notes": {
      "command": "npx",
      "args": ["tsx", "C:/Users/priya/OneDrive/Desktop/patch-notes/src/mcp-server/server.ts"],
      "env": {
        "SUPERMEMORY_API_KEY": "sm_jnNpbt8zsALUqAJpyZZYd1_vZoQdujWsl7sINc7Dqx2sIm5F63B6VHIRi73ZOOSHJmdxHsw5UFfZNWQ0j9Np12U",
        "SUPERMEMORY_BASE_URL": "http://localhost:6767",
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

### Claude Code Config (`.mcp.json` in project root)
```json
{
  "mcpServers": {
    "patch-notes": {
      "command": "npx",
      "args": ["tsx", "C:/Users/priya/OneDrive/Desktop/patch-notes/src/mcp-server/server.ts"],
      "env": {
        "SUPERMEMORY_API_KEY": "sm_jnNpbt8zsALUqAJpyZZYd1_vZoQdujWsl7sINc7Dqx2sIm5F63B6VHIRi73ZOOSHJmdxHsw5UFfZNWQ0j9Np12U",
        "SUPERMEMORY_BASE_URL": "http://localhost:6767",
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

### Cursor Config (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "patch-notes-mcp": {
      "command": "npx",
      "args": ["tsx", "C:/Users/priya/OneDrive/Desktop/patch-notes/src/mcp-server/server.ts"],
      "env": {
        "SUPERMEMORY_API_KEY": "sm_jnNpbt8zsALUqAJpyZZYd1_vZoQdujWsl7sINc7Dqx2sIm5F63B6VHIRi73ZOOSHJmdxHsw5UFfZNWQ0j9Np12U",
        "SUPERMEMORY_BASE_URL": "http://localhost:6767",
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

---

## 🎥 Demo Video
[Watch the demo video presentation](https://www.loom.com/share/3dce3530338144db9d0f01957656734e)
