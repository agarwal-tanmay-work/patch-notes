"use client";

import React, { useState } from "react";
import { 
  Play, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  ChevronRight, 
  Sparkles, 
  Clock,
  ArrowLeft,
  Info,
  Terminal,
  ShieldCheck,
  FileCode,
  Gauge,
  Upload,
  Link,
  Download,
  Calendar,
  Layers,
  Activity
} from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Presets updated with chronological dates
const DEMO_PRESETS = [
  {
    name: "React Router v6 Redirects",
    description: "Compare old React Router v5 Redirect component with modern v6 Navigate and useNavigate.",
    videoUrl: "https://www.youtube.com/watch?v=y881t8ilMyc",
    videoSourceName: "Tutorial v5 (2022)",
    videoSourceDate: "2022-04-12",
    docText: `# React Router v6 Navigation & Redirects Guide

In React Router v6, the component <Redirect> has been completely removed and replaced by the <Navigate> component. 

### Current Redirection Patterns:
1. **Component-based Redirect**:
   Use \`<Navigate to=\"/dashboard\" replace={true} />\` instead of \`<Redirect to=\"/dashboard\" />\`.
2. **Hook-based Navigation**:
   Use the \`useNavigate\` hook for programmatic navigation instead of \`useHistory\`.
   
### Example:
\`\`\`typescript
import { useNavigate, Navigate } from "react-router-dom";

// Component redirect
function ProtectedPage() {
  return <Navigate to="/login" replace />;
}

// Hook navigation
function LoginButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/dashboard")}>Login</button>;
}
\`\`\``,
    docSourceName: "React Router v6 Docs",
    docSourceDate: "2026-03-01"
  },
  {
    name: "Next.js Navigation (App Router)",
    description: "Compare Pages Router 'next/router' with App Router 'next/navigation' requirements.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoSourceName: "Tutorial Pages Router (2023)",
    videoSourceDate: "2023-08-15",
    docText: `# Next.js App Router Navigation

In the App Router, the navigation hook 'useRouter' must be imported from 'next/navigation' instead of 'next/router'. Importing from 'next/router' in a Server Component or App Router Client Component will result in a runtime crash.

### Guidelines:
1. **Import Source**: Always use \`import { useRouter } from 'next/navigation'\` in app router.
2. **Pathname and Query**: The hook \`useRouter\` in 'next/navigation' no longer contains \`pathname\` or \`query\` objects. Instead, use \`usePathname()\` and \`useSearchParams()\` separately.
3. **Prefetching**: Prefetching is enabled by default in the \`<Link>\` component.

### Example:
\`\`\`typescript
"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function NavigationDemo() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  return (
    <div>
      <p>Current Path: {pathname}</p>
      <button onClick={() => router.push("/settings")}>Settings</button>
    </div>
  );
}
\`\`\``,
    docSourceName: "Next.js App Router v15 Docs",
    docSourceDate: "2026-05-10"
  },
  {
    name: "Supermemory JS SDK",
    description: "Compare older client.memories.add signature with the modern client.add signature.",
    videoUrl: "https://www.youtube.com/watch?v=t705574H-A0",
    videoSourceName: "SDK Intro (2024)",
    videoSourceDate: "2024-11-20",
    docText: `# Supermemory JS SDK Reference

The modern JS SDK client simplifies adding documents and memories. The old \`client.memories.add\` is deprecated. You must use \`client.add\` directly on the initialized client.

### Quick Start:
\`\`\`typescript
import Supermemory from "supermemory";

const client = new Supermemory({
  apiKey: "sm_...",
  baseURL: "http://localhost:6767"
});

// Current method to add memories:
await client.add({
  content: "I am building a developer tool called Patch Notes.",
  containerTag: "project-patch-notes"
});
\`\`\``,
    docSourceName: "Supermemory SDK Docs",
    docSourceDate: "2026-07-01"
  }
];

function GraphView({ graph }: { graph: any }) {
  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-sm bg-zinc-900/10 border border-zinc-900 rounded-2xl">
        No graph representation available for this comparison.
      </div>
    );
  }

  // Position nodes hierarchically
  const topicNodes = graph.nodes.filter((n: any) => n.type === "topic");
  const sourceNodes = graph.nodes.filter((n: any) => n.type === "source");
  const claimNodes = graph.nodes.filter((n: any) => n.type === "claim" || n.type === "truth");

  const width = 800;
  const height = 360;
  const positions: Record<string, { x: number; y: number }> = {};

  topicNodes.forEach((node: any) => {
    positions[node.id] = { x: width / 2, y: 45 };
  });

  const sCount = sourceNodes.length;
  sourceNodes.forEach((node: any, idx: number) => {
    positions[node.id] = {
      x: sCount > 1 ? 120 + (idx * (width - 240)) / (sCount - 1) : width / 2,
      y: 155,
    };
  });

  const cCount = claimNodes.length;
  claimNodes.forEach((node: any, idx: number) => {
    positions[node.id] = {
      x: cCount > 1 ? 80 + (idx * (width - 160)) / (cCount - 1) : width / 2,
      y: 285,
    };
  });

  graph.nodes.forEach((node: any) => {
    if (!positions[node.id]) {
      positions[node.id] = { x: Math.random() * width, y: Math.random() * height };
    }
  });

  const getNodeColor = (type: string) => {
    switch (type) {
      case "topic":
        return "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white border-violet-500 shadow-violet-500/25";
      case "source":
        return "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700";
      case "claim":
        return "bg-rose-950/30 border-rose-900/40 text-rose-300 hover:border-rose-600";
      case "truth":
        return "bg-emerald-950/30 border-emerald-900/40 text-emerald-300 hover:border-emerald-600";
      default:
        return "bg-zinc-800 border-zinc-700 text-zinc-300";
    }
  };

  return (
    <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
          <Layers className="h-4.5 w-4.5 text-violet-400" /> Claims & Source Timeline Graph
        </h4>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-600"></span> Topic</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-zinc-700"></span> Source</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-600"></span> Old Claim</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-600"></span> Current Truth</span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto select-none" style={{ height: `${height}px` }}>
        <div className="absolute" style={{ width: `${width}px`, height: `${height}px` }}>
          {/* SVG Links */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="15"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#3f3f46" />
              </marker>
            </defs>
            {graph.edges.map((edge: any, idx: number) => {
              const start = positions[edge.from];
              const end = positions[edge.to];
              if (!start || !end) return null;

              const midY = (start.y + end.y) / 2;
              const pathD = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;

              return (
                <g key={idx}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                  />
                  {edge.label && (
                    <text
                      x={(start.x + end.x) / 2}
                      y={(start.y + end.y) / 2 - 3}
                      fill="#52525b"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes */}
          {graph.nodes.map((node: any) => {
            const pos = positions[node.id];
            if (!pos) return null;

            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`px-3 py-2 rounded-xl border text-[11px] font-bold text-center max-w-[150px] shadow-lg flex flex-col justify-center items-center transition duration-200 ${getNodeColor(
                  node.type
                )}`}
              >
                <span className="line-clamp-2">{node.label}</span>
                {node.type === "source" && (
                  <span className="text-[8px] text-zinc-500 font-normal mt-0.5 uppercase">Source</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const [step, setStep] = useState<"input" | "loading" | "compare">("input");
  
  // Form Inputs
  const [videoInputType, setVideoInputType] = useState<"url" | "file">("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [docText, setDocText] = useState("");
  const [topicName, setTopicName] = useState("");

  // Metadata inputs for Provenance
  const [videoSourceName, setVideoSourceName] = useState("Tutorial Video (2023)");
  const [videoSourceDate, setVideoSourceDate] = useState("2023-04-01");
  const [docSourceName, setDocSourceName] = useState("Official Docs (2026)");
  const [docSourceDate, setDocSourceDate] = useState(new Date().toISOString().split("T")[0]);
  
  // App States
  const [topicId, setTopicId] = useState("");
  const [pollingStatus, setPollingStatus] = useState("Initializing...");
  const [videoStatus, setVideoStatus] = useState<"queued" | "done" | "failed" | "processing">("queued");
  const [docStatus, setDocStatus] = useState<"queued" | "done" | "failed" | "processing">("queued");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Outputs
  const [summary, setSummary] = useState("");
  const [compatibilityScore, setCompatibilityScore] = useState<number>(100);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [graph, setGraph] = useState<any>({ nodes: [], edges: [] });
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const loadPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setVideoInputType("url");
    setVideoUrl(preset.videoUrl);
    setVideoFile(null);
    setDocText(preset.docText);
    setTopicName(preset.name);
    setVideoSourceName(preset.videoSourceName);
    setVideoSourceDate(preset.videoSourceDate);
    setDocSourceName(preset.docSourceName);
    setDocSourceDate(preset.docSourceDate);
  };

  const handleStartIngestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoInputType === "url" && !videoUrl) {
      setErrorMessage("Please provide a YouTube video URL.");
      return;
    }
    if (videoInputType === "file" && !videoFile) {
      setErrorMessage("Please select a video file to upload.");
      return;
    }
    if (!docText) {
      setErrorMessage("Please provide Documentation text.");
      return;
    }
    
    setErrorMessage("");
    setStep("loading");
    setPollingStatus("Submitting documents & provenance metadata to Supermemory Local...");
    setVideoStatus("queued");
    setDocStatus("queued");

    try {
      const formData = new FormData();
      formData.append("docText", docText);
      formData.append("topicName", topicName);
      formData.append("videoSourceName", videoSourceName);
      formData.append("videoSourceDate", videoSourceDate);
      formData.append("docSourceName", docSourceName);
      formData.append("docSourceDate", docSourceDate);
      
      if (videoInputType === "file" && videoFile) {
        formData.append("videoFile", videoFile);
      } else {
        formData.append("videoUrl", videoUrl);
      }

      const res = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setTopicId(data.topicId);
      setPollingStatus("Documents queued. Starting background analysis...");
      startPolling(data.topicId);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStep("input");
    }
  };

  const startPolling = (tid: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) {
        clearInterval(interval);
        setErrorMessage("Ingestion timed out. The server took too long to process.");
        setStep("input");
        return;
      }

      try {
        const res = await fetch(`/api/status?topicId=${tid}`);
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to check status.");
        }

        const memories = data.memories || [];
        const videoDoc = memories.find((m: any) => m.type === "video" || m.metadata?.source === "video");
        const textDoc = memories.find((m: any) => m.type === "text" || m.type === "document" || m.metadata?.source === "documentation");

        if (videoDoc) setVideoStatus(videoDoc.status || "done");
        if (textDoc) setDocStatus(textDoc.status || "done");

        // Since it's a simulated local environment, check if status is complete
        // In local Supermemory, adding direct strings resolves immediately, so status might be instantly 'done'
        const isVideoDone = !videoDoc || videoDoc.status === "done" || videoDoc.status === "processing";
        const isDocDone = !textDoc || textDoc.status === "done" || textDoc.status === "processing";

        if (isVideoDone && isDocDone) {
          clearInterval(interval);
          setPollingStatus("Reconstructing provenance timeline & mapping claims relationship graph...");
          await fetchComparison(tid);
        } else {
          setPollingStatus("Transcribing video contents & indexing documentation graph...");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);
  };

  const fetchComparison = async (tid: string) => {
    try {
      const res = await fetch(`/api/compare?topicId=${tid}`);
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to compute comparison.");
      }

      setSummary(data.summary);
      setCompatibilityScore(data.compatibilityScore);
      setComparisons(data.comparisons || []);
      setGraph(data.graph || { nodes: [], edges: [] });
      setStep("compare");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate comparison.");
      setStep("input");
    }
  };

  const handleExportMarkdown = () => {
    let md = `# Patch Notes Compatibility Report: ${topicName || "Topic"}\n\n`;
    md += `**Compatibility Score:** ${compatibilityScore}%\n\n`;
    md += `## Summary\n${summary}\n\n`;
    md += `## Provenance & Claims Evolution\n\n`;
    
    comparisons.forEach((item, index) => {
      md += `### ${index + 1}. [${item.severity.toUpperCase()}] ${item.claim}\n\n`;
      
      if (item.history && item.history.length > 0) {
        md += `#### Chronological Timeline:\n`;
        item.history.forEach((hist: any) => {
          md += `- **${hist.date}** (${hist.source}): ${hist.statement}\n`;
          if (hist.code) md += `  \`\`\`typescript\n  ${hist.code}\n  \`\`\`\n`;
        });
        md += `\n`;
      }

      md += `* **Current Documentation Truth:** ${item.truth}\n\n`;
      md += `#### Explanation & Impact\n${item.explanation}\n\n`;
      
      if (item.oldCode) {
        md += `#### Outdated Code\n\`\`\`typescript\n${item.oldCode}\n\`\`\`\n\n`;
      }
      if (item.newCode) {
        md += `#### Correct Code\n\`\`\`typescript\n${item.newCode}\n\`\`\`\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(topicName || "patch-notes").toLowerCase().replace(/\s+/g, "-")}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredComparisons = comparisons.filter(c => {
    if (activeSeverityFilter === "all") return true;
    return c.severity === activeSeverityFilter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (score >= 70) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-rose-400 border-rose-500/20 bg-rose-500/5";
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "high":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Breaking (High)</span>;
      case "medium":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Warning (Medium)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Info (Low)</span>;
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 font-sans min-h-screen selection:bg-violet-600/30 selection:text-violet-200">
      
      {/* Header Banner */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <FileCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">PATCH NOTES</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">Supermemory Local Edition</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-violet-400" /> Fully Local Storage</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col justify-center flex-1">
        
        {/* STEP 1: INPUT FORM */}
        {step === "input" && (
          <div className="space-y-10 animate-fade-in">
            {/* Hero text */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Hackathon Solo Project
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Tutorial vs Documentation Compatibility Analyzer
              </h1>
              <p className="text-zinc-400 text-base leading-relaxed">
                Watches a tutorial video, indexes it inside <strong className="text-violet-400">Supermemory Local</strong> alongside current documentation, and highlights outdated claims and code syntax side-by-side.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-sm flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Form + Preset Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
              
              {/* Form Input fields */}
              <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-zinc-900 pb-3">
                  <Terminal className="h-4 w-4 text-violet-400" /> Start Analysis & Ingestion
                </h2>
                <form onSubmit={handleStartIngestion} className="space-y-6">
                  
                  {/* Topic name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300">
                      Topic Name
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. React Router v6 Redirects"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Video Input Group */}
                  <div className="border border-zinc-900/60 bg-zinc-950/20 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <label className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                        <Play className="h-4 w-4 text-rose-400" /> Tutorial Video Source
                      </label>
                      <div className="flex gap-2 p-0.5 bg-zinc-950 border border-zinc-850 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setVideoInputType("url")}
                          className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition ${
                            videoInputType === "url" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <Link className="h-3 w-3" /> URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoInputType("file")}
                          className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition ${
                            videoInputType === "file" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <Upload className="h-3 w-3" /> Upload
                        </button>
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1"><Info className="h-3 w-3" /> Source Name</span>
                        <input
                          type="text"
                          placeholder="e.g. Tutorial Video (2023)"
                          value={videoSourceName}
                          onChange={(e) => setVideoSourceName(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> Publish Date</span>
                        <input
                          type="date"
                          value={videoSourceDate}
                          onChange={(e) => setVideoSourceDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                          required
                        />
                      </div>
                    </div>

                    {videoInputType === "url" ? (
                      <input 
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        required={videoInputType === "url"}
                      />
                    ) : (
                      <div className="border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 rounded-xl p-5 transition flex flex-col items-center justify-center text-center cursor-pointer relative">
                        <input
                          type="file"
                          accept="video/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                          required={videoInputType === "file"}
                        />
                        <Upload className="h-5 w-5 text-zinc-500 mb-1" />
                        {videoFile ? (
                          <p className="text-xs font-bold text-violet-400">{videoFile.name}</p>
                        ) : (
                          <p className="text-xs text-zinc-400">Click or drag video file here</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Documentation Input Group */}
                  <div className="border border-zinc-900/60 bg-zinc-950/20 p-5 rounded-2xl space-y-4">
                    <label className="text-sm font-bold text-zinc-200 flex items-center gap-2 border-b border-zinc-900 pb-2">
                      <FileText className="h-4 w-4 text-violet-400" /> Official Documentation Source
                    </label>

                    {/* Metadata fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1"><Info className="h-3 w-3" /> Doc Source Name</span>
                        <input
                          type="text"
                          placeholder="e.g. Official Docs (2026)"
                          value={docSourceName}
                          onChange={(e) => setDocSourceName(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> Source Date</span>
                        <input
                          type="date"
                          value={docSourceDate}
                          onChange={(e) => setDocSourceDate(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                          required
                        />
                      </div>
                    </div>

                    <textarea 
                      placeholder="Paste current documentation text or markdown API references..."
                      value={docText}
                      onChange={(e) => setDocText(e.target.value)}
                      rows={6}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm transition shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Compare Video and Docs <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                  </button>
                </form>
              </div>

              {/* Preset Side Panel */}
              <div className="space-y-4">
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" /> Demo Presets
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Click a preset to quickly prefill dated timeline data and verify how provenance timelines are constructed.
                  </p>
                  
                  <div className="space-y-3">
                    {DEMO_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadPreset(preset)}
                        className="w-full text-left p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/20 transition cursor-pointer flex flex-col gap-1"
                      >
                        <span className="text-sm font-bold text-violet-400">{preset.name}</span>
                        <span className="text-xs text-zinc-400 line-clamp-2">{preset.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-violet-950/10 border border-violet-900/20 rounded-2xl p-6 space-y-3">
                  <h4 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                    <Info className="h-4 w-4 text-violet-400" /> Provenance Upgrades
                  </h4>
                  <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                    <li>Chronological timeline tracking.</li>
                    <li>Saves exact metadata: source, URLs, dates.</li>
                    <li>Exposed over local MCP tool server.</li>
                    <li>Generates claims relationship graph.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: INGESTION LOADER */}
        {step === "loading" && (
          <div className="max-w-xl mx-auto w-full bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 text-center space-y-8 animate-pulse">
            <div className="flex justify-center">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin"></div>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Processing Ingestion</h2>
              <p className="text-zinc-400 text-sm">{pollingStatus}</p>
            </div>
            <div className="border-t border-zinc-900 pt-6 space-y-4 text-left">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
                <span className="text-sm flex items-center gap-2 font-medium">
                  <Play className="h-4 w-4 text-rose-400" /> Tutorial Video Indexing
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 capitalize">
                  {videoStatus === "done" && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                  {videoStatus === "queued" && <Clock className="h-3 w-3 text-zinc-500 animate-spin" />}
                  {videoStatus === "failed" && <AlertTriangle className="h-3 w-3 text-rose-500" />}
                  {videoStatus === "done" ? "done" : "processing"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
                <span className="text-sm flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4 text-violet-400" /> Documentation Parsing
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 capitalize">
                  {docStatus === "done" && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                  {docStatus === "queued" && <Clock className="h-3 w-3 text-zinc-500 animate-spin" />}
                  {docStatus === "failed" && <AlertTriangle className="h-3 w-3 text-rose-500" />}
                  {docStatus === "done" ? "done" : "processing"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: COMPARISON VIEW */}
        {step === "compare" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Bar Actions */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setStep("input")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Start Over
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition cursor-pointer"
                >
                  <Download className="h-4 w-4" /> Export Report
                </button>
                <div className="text-xs text-zinc-500 font-mono hidden sm:block">
                  Slugified Tag: {topicId}
                </div>
              </div>
            </div>

            {/* Score & Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-sm font-bold text-zinc-400 tracking-wider uppercase">Compatibility Score</span>
                <div className={`h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(compatibilityScore)}`}>
                  <Gauge className="h-6 w-6 opacity-60 mb-0.5" />
                  <span className="text-2xl font-extrabold">{compatibilityScore}%</span>
                </div>
                <span className="text-xs text-zinc-400">
                  {compatibilityScore >= 90 ? "Excellent. The video claims align with current documentation." : 
                   compatibilityScore >= 70 ? "Warning. Several deprecated methods were noticed." : 
                   "Critical. Outdated claims will cause compile errors."}
                </span>
              </div>

              <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-200 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-violet-400" /> Freshness Comparison Summary
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {summary}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-xs border-t border-zinc-900 pt-4 text-zinc-400">
                  <span><strong>Total Claims:</strong> {comparisons.length}</span>
                  <span><strong>Breaking Claims:</strong> {comparisons.filter(c => c.severity === "high").length}</span>
                </div>
              </div>
            </div>

            {/* Graph view - Upgrade 3 */}
            <GraphView graph={graph} />

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <button 
                onClick={() => setActiveSeverityFilter("all")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  activeSeverityFilter === "all" ? "bg-violet-600 text-white border-violet-500" : "bg-transparent border-zinc-900 text-zinc-400 hover:border-zinc-800"
                }`}
              >
                All ({comparisons.length})
              </button>
              <button 
                onClick={() => setActiveSeverityFilter("high")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  activeSeverityFilter === "high" ? "bg-rose-600 text-white border-rose-500" : "bg-transparent border-zinc-900 text-zinc-400 hover:border-zinc-800"
                }`}
              >
                Breaking ({comparisons.filter(c => c.severity === "high").length})
              </button>
              <button 
                onClick={() => setActiveSeverityFilter("medium")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  activeSeverityFilter === "medium" ? "bg-amber-600 text-white border-amber-500" : "bg-transparent border-zinc-900 text-zinc-400 hover:border-zinc-800"
                }`}
              >
                Warnings ({comparisons.filter(c => c.severity === "medium").length})
              </button>
            </div>

            {/* List of Comparisons */}
            <div className="space-y-6">
              {filteredComparisons.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900/20 border border-zinc-900 rounded-2xl text-zinc-400 text-sm">
                  No issues found for the selected filter.
                </div>
              ) : (
                filteredComparisons.map((item, idx) => (
                  <div key={idx} className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg border-l-4 border-l-violet-600">
                    
                    {/* Header bar of comparison */}
                    <div className="px-6 py-4 bg-zinc-900/40 border-b border-zinc-900 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 text-xs font-bold font-mono">#{idx+1}</span>
                        {getSeverityBadge(item.severity)}
                        <h4 className="text-sm font-extrabold text-zinc-200">{item.claim}</h4>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Chronological Provenance History Timeline */}
                      {item.history && item.history.length > 0 && (
                        <div className="bg-zinc-950/60 border border-zinc-900/60 rounded-xl p-5 space-y-4">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5" /> Chronological Claims History
                          </span>
                          
                          <div className="relative border-l border-zinc-800 pl-4 ml-1 space-y-4">
                            {item.history.map((hist: any, hIdx: number) => (
                              <div key={hIdx} className="relative">
                                {/* Dot indicator */}
                                <div className="absolute -left-[21px] mt-1.5 h-2.5 w-2.5 rounded-full border border-violet-500 bg-zinc-950"></div>
                                <div className="flex items-baseline justify-between gap-2 flex-wrap text-xxs font-bold text-zinc-500">
                                  <span>{hist.source}</span>
                                  <span>{hist.date}</span>
                                </div>
                                <p className="text-xs text-zinc-300 mt-1">{hist.statement}</p>
                                {hist.code && (
                                  <pre className="mt-1.5 p-2 bg-zinc-950 border border-zinc-900 text-rose-400/80 rounded font-mono text-[10px] overflow-x-auto">
                                    <code>{hist.code}</code>
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Outdated Video Claim */}
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-5 space-y-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                            <Play className="h-3 w-3 shrink-0" /> Old Claim Source
                          </span>
                          <p className="text-sm font-semibold text-zinc-200">
                            {item.history && item.history.length > 0 ? item.history[0].statement : "Claim made in old video."}
                          </p>
                        </div>

                        {/* Current Documentation Truth */}
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5 space-y-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3 shrink-0" /> Latest Documentation Truth
                          </span>
                          <p className="text-sm font-semibold text-zinc-200">
                            {item.truth}
                          </p>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-2">
                        <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5 text-violet-400" /> What Changed & Impact
                        </span>
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>

                      {/* Code Diff Section */}
                      {(item.oldCode || item.newCode) && (
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                            <Code className="h-3.5 w-3.5 text-violet-400" /> Syntax Migration Diff
                          </span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {item.oldCode && (
                              <div className="bg-rose-950/20 border border-rose-900/20 rounded-xl overflow-hidden font-mono text-xs">
                                <div className="bg-rose-950/40 border-b border-rose-900/20 px-4 py-2 text-rose-400 font-semibold flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-rose-500"></span> - Outdated Code
                                </div>
                                <pre className="p-4 text-rose-300 overflow-x-auto whitespace-pre-wrap">
                                  <code>{item.oldCode}</code>
                                </pre>
                              </div>
                            )}

                            {item.newCode && (
                              <div className="bg-emerald-950/20 border border-emerald-900/20 rounded-xl overflow-hidden font-mono text-xs">
                                <div className="bg-emerald-950/40 border-b border-emerald-900/20 px-4 py-2 text-emerald-400 font-semibold flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> + Correct Code
                                </div>
                                <pre className="p-4 text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                                  <code>{item.newCode}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 mt-12 text-center text-xs text-zinc-500">
        <p>© 2026 Patch Notes. Powered by Supermemory Local Server and Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  );
}
