# Patch Notes 📝

**Patch Notes** is a developer utility that helps you keep coding tutorials up to date. It compares a tutorial video's claims with current official documentation, highlighting outdated API usages, deprecated functions, and syntax changes side-by-side.

Built for **Localhost:6767 — Supermemory Local Hackathon (July 9–13)**.

---

## 🚀 How it Works

1. **Ingest Video & Docs**: Provide a YouTube video URL and paste the latest official documentation text.
2. **Local Graph Integration**:
   - The video is indexed and transcribed by the local **Supermemory Server** container.
   - The documentation is parsed and indexed in the same **containerTag** (acting as a topic boundary).
3. **Semantic Extraction**:
   - We query the Supermemory local engine using hybrid search and profile retrieval to extract all facts from both sources.
4. **Delta Comparison**:
   - An LLM (Gemini) compares the extracted facts, identifying outdated video claims, highlighting the current truth, and showing a side-by-side code diff.

---

## 🛠️ Architecture

```
                      +-------------------+
                      |   User Browser    |
                      +---------+---------+
                                |
                                | HTTP JSON
                                v
                      +---------+---------+
                      |  Next.js App      |
                      +----+---------+----+
                           |         |
      Supermemory SDK      |         | REST API
      (port 6767)          |         | (with GEMINI_API_KEY)
                           v         v
                +----------+--+   +--+----------+
                | Supermemory |   | Gemini API  |
                |   Server    |   |  (LLM)      |
                |  (Docker)   |   +-------------+
                +-------------+
```

---

## 📦 Getting Started

### 1. Run Supermemory Local (Docker)

Since Windows is not natively supported by the official Supermemory shell script, we run it containerized. 

Build and run the container:
```bash
# 1. Build the Docker image
docker build -t supermemory-local ./scratch

# 2. Start the container with your Gemini API key
docker run -d --name supermemory-server -p 6767:6767 -v supermemory-data:/root/.supermemory -e GEMINI_API_KEY="your_api_key_here" supermemory-local
```

On first startup, the server automatically downloads the local embeddings model `Xenova/bge-base-en-v1.5` and listens on `http://localhost:6767`. 

Check the logs to grab the generated **API key**:
```bash
docker logs supermemory-server
```

---

### 2. Configure Next.js Application

1. Clone the repository and navigate into it:
   ```bash
   cd patch-notes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root of the project with the following:
   ```env
   SUPERMEMORY_API_KEY=sm_your_supermemory_api_key_here
   SUPERMEMORY_BASE_URL=http://localhost:6767
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

### 3. Run the App

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💎 Demo Presets Included

The UI includes ready-to-use presets so you can test the analysis workflow instantly:
1. **React Router v6 Redirects**: Compares obsolete `<Redirect>` syntax with current `<Navigate>` and the `useNavigate` hook.
2. **Next.js Navigation (App Router)**: Compares Pages Router `next/router` imports with App Router `next/navigation` imports.
3. **Supermemory JS SDK**: Compares old `client.memories.add` method with modern `client.add`.

---

## 🛡️ License

MIT
