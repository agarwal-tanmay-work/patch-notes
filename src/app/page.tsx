"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Variants for orchestrating transitions
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.08
    }
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.25, ease: "easeIn" as const }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 }
  }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

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
      <div className="p-8 text-center text-[#6b7280] text-xs bg-[#f9fafb] border border-[#333333] rounded-2xl">
        No graph representation available for this comparison.
      </div>
    );
  }

  // Position nodes hierarchically
  const width = 1000;
  const height = 400;
  const positions: Record<string, { x: number; y: number }> = {};

  const rows: Record<string, any[]> = {
    topic: [],
    source: [],
    claim: [],
    truth: [],
    other: []
  };

  graph.nodes.forEach((node: any) => {
    const type = node.type?.toLowerCase();
    if (type === "topic") rows.topic.push(node);
    else if (type === "source") rows.source.push(node);
    else if (type === "claim") rows.claim.push(node);
    else if (type === "truth") rows.truth.push(node);
    else rows.other.push(node);
  });

  // 1. Topic Row (y = 45)
  rows.topic.forEach((node, idx) => {
    positions[node.id] = {
      x: rows.topic.length > 1 ? 150 + (idx * (width - 300)) / (rows.topic.length - 1) : width / 2,
      y: 45
    };
  });

  // 2. Source Row (y = 130)
  rows.source.forEach((node, idx) => {
    positions[node.id] = {
      x: rows.source.length > 1 ? 150 + (idx * (width - 300)) / (rows.source.length - 1) : width / 2,
      y: 130
    };
  });

  // 3. Claim Row (y = 215)
  rows.claim.forEach((node, idx) => {
    positions[node.id] = {
      x: rows.claim.length > 1 ? 120 + (idx * (width - 240)) / (rows.claim.length - 1) : width / 2,
      y: 215
    };
  });

  // 4. Truth Row (y = 300) - Align directly under corresponding claim nodes by index
  rows.truth.forEach((node, idx) => {
    let targetX = width / 2;
    if (idx < rows.claim.length) {
      const claimNode = rows.claim[idx];
      if (positions[claimNode.id]) {
        targetX = positions[claimNode.id].x;
      }
    } else {
      const remLength = rows.truth.length - rows.claim.length;
      const remIdx = idx - rows.claim.length;
      targetX = remLength > 1 ? 120 + (remIdx * (width - 240)) / (remLength - 1) : width / 2;
    }
    positions[node.id] = {
      x: targetX,
      y: 300
    };
  });

  // 5. Other Row (y = 360)
  rows.other.forEach((node, idx) => {
    positions[node.id] = {
      x: rows.other.length > 1 ? 120 + (idx * (width - 240)) / (rows.other.length - 1) : width / 2,
      y: 360
    };
  });

  const getNodeColor = (type: string) => {
    switch (type) {
      case "topic":
        return "bg-black text-white border-[#333333]";
      case "source":
        return "bg-white border-[#333333] text-black hover:bg-[#f3f4f6]";
      case "claim":
        return "bg-[#fcab83] border-[#333333] text-black"; // Restrained: Salmon restricted only to comparison nodes
      case "truth":
        return "bg-[#9ef58f] border-[#333333] text-black"; // Restrained: Green restricted only to comparison nodes
      default:
        return "bg-white border-[#333333] text-black";
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-[#f9fafb] border border-[#333333] rounded-2xl p-6 relative overflow-hidden shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#d37bff]" /> Claims & Source Timeline Graph
        </h4>
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-black"></span> Topic</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white border border-[#333333]"></span> Source</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#fcab83]"></span> Old Claim</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#9ef58f]"></span> Current Truth</span>
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
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#333333" />
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
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#333333"
                    strokeWidth="1.5"
                    markerEnd="url(#arrow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  />
                  {edge.label && (
                    <motion.text
                      x={(start.x + end.x) / 2}
                      y={(start.y + end.y) / 2 - 3}
                      fill="#6b7280"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {edge.label}
                    </motion.text>
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
              <motion.div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`px-3 py-2 rounded-2xl border text-[10px] font-bold text-center max-w-[150px] transition duration-200 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] ${getNodeColor(
                  node.type
                )}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="line-clamp-2">{node.label}</span>
                {node.type === "source" && (
                  <span className="text-[7px] text-[#6b7280] font-normal mt-0.5 uppercase block">Source</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
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
      if (attempts > 150) {
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

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "high":
        return <span className="px-2.5 py-1 rounded-2xl text-[9px] font-bold bg-[#fcab83] border border-[#333333] text-black">Breaking</span>;
      case "medium":
        return <span className="px-2.5 py-1 rounded-2xl text-[9px] font-bold bg-[#fcab83]/50 border border-[#333333] text-black">Warning</span>;
      default:
        return <span className="px-2.5 py-1 rounded-2xl text-[9px] font-bold bg-[#f3f4f6] border border-[#333333] text-black">Info</span>;
    }
  };

  return (
    <div className="flex-1 bg-white text-black min-h-screen">
      
      {/* Header Banner */}
      <header className="border-b border-[#333333] bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white border border-[#333333] flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Patch Notes Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-black">PATCH NOTES</span>
              <span className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded-2xl bg-[#f3f4f6] text-black border border-[#333333]">Supermemory Local Edition</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#6b7280]">
            <span className="flex items-center gap-1.5 font-bold"><ShieldCheck className="h-4 w-4 text-[#d37bff]" /> Fully Local Storage</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col justify-center flex-1">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: INPUT FORM */}
          {step === "input" && (
            <motion.div 
              key="input"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-10"
            >
              {/* Hero text */}
              <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-[#f3f4f6] border border-[#333333] text-xs font-bold text-black">
                  <Sparkles className="h-3.5 w-3.5 text-[#d37bff]" /> Hackathon Developer Utility
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                  Tutorial vs Documentation Compatibility Analyzer
                </h1>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Index tutorial videos and documentation locally inside <strong className="text-[#d37bff]">Supermemory Local</strong> to analyze claims history, verify freshness, and map claims relationship graphs.
                </p>
              </motion.div>

              {/* Error Message */}
              {errorMessage && (
                <motion.div variants={itemVariants} className="max-w-3xl mx-auto p-4 rounded-2xl bg-[#fcab83]/20 border border-[#333333] text-black text-xs flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-black" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Main Form + Preset Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                
                {/* Form Input fields */}
                <motion.div 
                  variants={itemVariants} 
                  className="lg:col-span-2 bg-[#f9fafb] border border-[#333333] rounded-2xl p-6 md:p-8 space-y-6 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
                >
                  <h2 className="text-xs font-bold flex items-center gap-2 border-b border-[#333333] pb-3 text-black uppercase tracking-wider">
                    <Terminal className="h-4 w-4 text-[#d37bff]" /> Start Analysis & Ingestion
                  </h2>
                  <form onSubmit={handleStartIngestion} className="space-y-6">
                    
                    {/* Topic name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                        Topic Name
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. React Router v6 Redirects"
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        className="w-full bg-white border border-[#333333] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d37bff] transition"
                        required
                      />
                    </div>

                    {/* Video Input Group */}
                    <div className="border border-[#333333] bg-white p-5 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-[#333333] pb-2">
                        <label className="text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-2">
                          <Play className="h-4 w-4 text-[#d37bff]" /> Tutorial Video Source
                        </label>
                        <div className="flex gap-2 p-0.5 bg-white border border-[#333333] rounded-2xl">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setVideoInputType("url")}
                            className={`px-3 py-1 text-[10px] font-bold rounded-2xl flex items-center gap-1 cursor-pointer transition ${
                              videoInputType === "url" ? "bg-[#d37bff] text-white border border-[#333333]" : "text-[#6b7280] hover:text-black"
                            }`}
                          >
                            <Link className="h-3 w-3" /> URL
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setVideoInputType("file")}
                            className={`px-3 py-1 text-[10px] font-bold rounded-2xl flex items-center gap-1 cursor-pointer transition ${
                              videoInputType === "file" ? "bg-[#d37bff] text-white border border-[#333333]" : "text-[#6b7280] hover:text-black"
                            }`}
                          >
                            <Upload className="h-3 w-3" /> Upload
                          </motion.button>
                        </div>
                      </div>

                      {/* Metadata fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1"><Info className="h-3 w-3" /> Source Name</span>
                          <input
                            type="text"
                            placeholder="e.g. Tutorial Video (2023)"
                            value={videoSourceName}
                            onChange={(e) => setVideoSourceName(e.target.value)}
                            className="w-full bg-white border border-[#333333] rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#d37bff]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1"><Calendar className="h-3 w-3" /> Publish Date</span>
                          <input
                            type="date"
                            value={videoSourceDate}
                            onChange={(e) => setVideoSourceDate(e.target.value)}
                            className="w-full bg-white border border-[#333333] rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#d37bff]"
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
                          className="w-full bg-white border border-[#333333] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d37bff]"
                          required={videoInputType === "url"}
                        />
                      ) : (
                        <div className="border border-dashed border-[#333333] hover:border-black bg-white rounded-2xl p-5 transition flex flex-col items-center justify-center text-center cursor-pointer relative">
                          <input
                            type="file"
                            accept="video/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            required={videoInputType === "file"}
                          />
                          <Upload className="h-5 w-5 text-[#6b7280] mb-1" />
                          {videoFile ? (
                            <p className="text-xs font-bold text-[#d37bff]">{videoFile.name}</p>
                          ) : (
                            <p className="text-xs text-[#6b7280]">Click or drag video file here</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Documentation Input Group */}
                    <div className="border border-[#333333] bg-white p-5 rounded-2xl space-y-4">
                      <label className="text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-2 border-b border-[#333333] pb-2">
                        <FileText className="h-4 w-4 text-[#d37bff]" /> Official Documentation Source
                      </label>

                      {/* Metadata fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1"><Info className="h-3 w-3" /> Doc Source Name</span>
                          <input
                            type="text"
                            placeholder="e.g. Official Docs (2026)"
                            value={docSourceName}
                            onChange={(e) => setDocSourceName(e.target.value)}
                            className="w-full bg-white border border-[#333333] rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#d37bff]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1"><Calendar className="h-3 w-3" /> Source Date</span>
                          <input
                            type="date"
                            value={docSourceDate}
                            onChange={(e) => setDocSourceDate(e.target.value)}
                            className="w-full bg-white border border-[#333333] rounded-2xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#d37bff]"
                            required
                          />
                        </div>
                      </div>

                      <textarea 
                        placeholder="Paste current documentation text or markdown API references..."
                        value={docText}
                        onChange={(e) => setDocText(e.target.value)}
                        rows={6}
                        className="w-full bg-white border border-[#333333] rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#d37bff] resize-none"
                        required
                      />
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-[#d37bff] hover:opacity-90 border border-[#333333] text-white font-bold text-sm transition shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px] flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      Compare Video and Docs <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                    </motion.button>
                  </form>
                </motion.div>

                {/* Preset Side Panel */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="bg-[#f9fafb] border border-[#333333] rounded-2xl p-6 space-y-4 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
                    <h3 className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#d37bff]" /> Demo Presets
                    </h3>
                    <p className="text-xs text-[#6b7280] leading-relaxed">
                      Click a preset to quickly prefill dated timeline data and verify how provenance timelines are constructed.
                    </p>
                    
                    <div className="space-y-3">
                      {DEMO_PRESETS.map((preset, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => loadPreset(preset)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full text-left p-4 rounded-2xl bg-white border border-[#333333] hover:bg-[#f3f4f6] transition cursor-pointer flex flex-col gap-1 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
                        >
                          <span className="text-xs font-bold text-black">{preset.name}</span>
                          <span className="text-[10px] text-[#6b7280] line-clamp-2">{preset.description}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-[#333333] rounded-2xl p-6 space-y-3">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-wider flex items-center gap-2">
                      <Info className="h-4 w-4 text-[#d37bff]" /> Provenance Upgrades
                    </h4>
                    <ul className="text-[11px] text-[#6b7280] space-y-2 list-disc list-inside">
                      <li>Chronological timeline tracking</li>
                      <li>Saves exact metadata: source, URLs, dates</li>
                      <li>Exposed over local MCP tool server</li>
                      <li>Generates claims relationship graph</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INGESTION LOADER (SKELETON SHIMMER) */}
          {step === "loading" && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="max-w-xl mx-auto w-full bg-[#f9fafb] border border-[#333333] rounded-2xl p-8 space-y-8 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
            >
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-black uppercase tracking-wider">Processing Ingestion</h2>
                <p className="text-[#6b7280] text-xs font-mono">{pollingStatus}</p>
              </div>
              
              {/* Shimmer layout */}
              <div className="space-y-4">
                <div className="h-10 w-full rounded-2xl skeleton-shimmer border border-[#333333]/20"></div>
                <div className="h-10 w-full rounded-2xl skeleton-shimmer border border-[#333333]/20"></div>
                <div className="h-4 w-3/4 rounded-2xl skeleton-shimmer"></div>
              </div>
              
              <div className="border-t border-[#333333] pt-6 space-y-4 text-left">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#333333]">
                  <span className="text-xs flex items-center gap-2 font-bold text-black">
                    <Play className="h-4 w-4 text-[#d37bff]" /> Tutorial Video Indexing
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-2xl bg-[#f3f4f6] border border-[#333333] flex items-center gap-1.5 capitalize text-black">
                    {videoStatus === "done" && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                    {(videoStatus === "queued" || videoStatus === "processing") && <Clock className="h-3.5 w-3.5 text-[#6b7280] animate-spin" />}
                    {videoStatus === "failed" && <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />}
                    {videoStatus === "done" ? "done" : videoStatus === "failed" ? "failed" : "processing"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#333333]">
                  <span className="text-xs flex items-center gap-2 font-bold text-black">
                    <FileText className="h-4 w-4 text-[#d37bff]" /> Documentation Parsing
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-2xl bg-[#f3f4f6] border border-[#333333] flex items-center gap-1.5 capitalize text-black">
                    {docStatus === "done" && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                    {(docStatus === "queued" || docStatus === "processing") && <Clock className="h-3.5 w-3.5 text-[#6b7280] animate-spin" />}
                    {docStatus === "failed" && <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />}
                    {docStatus === "done" ? "done" : docStatus === "failed" ? "failed" : "processing"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: COMPARISON VIEW */}
          {step === "compare" && (
            <motion.div 
              key="compare"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Top Bar Actions */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <motion.button 
                  onClick={() => setStep("input")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl bg-white border border-[#333333] hover:bg-[#f3f4f6] transition cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Start Over
                </motion.button>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleExportMarkdown}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl bg-[#d37bff] hover:opacity-90 text-white border border-[#333333] transition cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Export Report
                  </motion.button>
                  <div className="text-[10px] text-[#6b7280] font-mono hidden sm:block">
                    Tag: {topicId}
                  </div>
                </div>
              </motion.div>

              {/* Score & Summary Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <motion.div variants={itemVariants} className="bg-[#f9fafb] border border-[#333333] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
                  <span className="text-[10px] font-bold text-[#6b7280] tracking-wider uppercase">Compatibility Score</span>
                  {/* Restrained: Grayscale border for score UI chrome, not red/green */}
                  <div className="h-28 w-28 rounded-full border-2 border-[#333333] flex flex-col items-center justify-center bg-white">
                    <Gauge className="h-6 w-6 opacity-60 mb-0.5 text-black" />
                    <span className="text-2xl font-extrabold text-black">{compatibilityScore}%</span>
                  </div>
                  <span className="text-[10px] text-[#6b7280] uppercase tracking-wider font-bold">
                    {compatibilityScore >= 90 ? "High Compatibility" : 
                     compatibilityScore >= 70 ? "Medium Deprecation" : 
                     "Critical Outdates"}
                  </span>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2 bg-[#f9fafb] border border-[#333333] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
                  <div>
                    <h3 className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-[#d37bff]" /> Comparison Summary
                    </h3>
                    <p className="text-xs text-black leading-relaxed">
                      {summary}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] border-t border-[#333333]/25 pt-4 text-[#6b7280] font-bold">
                    <span>Total Claims: {comparisons.length}</span>
                    <span>Breaking Claims: {comparisons.filter(c => c.severity === "high").length}</span>
                  </div>
                </motion.div>
              </div>

              {/* Graph view - Upgrade 3 */}
              <GraphView graph={graph} />

              {/* Filter Tabs */}
              <motion.div variants={itemVariants} className="flex items-center gap-2 border-b border-[#333333] pb-3">
                <button 
                  onClick={() => setActiveSeverityFilter("all")}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                    activeSeverityFilter === "all" ? "bg-[#d37bff] text-white border-[#333333]" : "bg-transparent border-[#333333]/20 text-[#6b7280] hover:border-[#333333]"
                  }`}
                >
                  All ({comparisons.length})
                </button>
                <button 
                  onClick={() => setActiveSeverityFilter("high")}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                    activeSeverityFilter === "high" ? "bg-black text-white border-[#333333]" : "bg-transparent border-[#333333]/20 text-[#6b7280] hover:border-[#333333]"
                  }`}
                >
                  Breaking ({comparisons.filter(c => c.severity === "high").length})
                </button>
                <button 
                  onClick={() => setActiveSeverityFilter("medium")}
                  className={`px-4 py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                    activeSeverityFilter === "medium" ? "bg-black/60 text-white border-[#333333]" : "bg-transparent border-[#333333]/20 text-[#6b7280] hover:border-[#333333]"
                  }`}
                >
                  Warnings ({comparisons.filter(c => c.severity === "medium").length})
                </button>
              </motion.div>

              {/* List of Comparisons */}
              <motion.div 
                variants={listContainerVariants}
                className="space-y-6"
              >
                {filteredComparisons.length === 0 ? (
                  <div className="p-8 text-center bg-[#f9fafb] border border-[#333333] rounded-2xl text-[#6b7280] text-xs">
                    No issues found for the selected filter.
                  </div>
                ) : (
                  filteredComparisons.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      variants={itemVariants}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="bg-white border border-[#333333] rounded-2xl overflow-hidden shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]"
                    >
                      
                      {/* Header bar of comparison */}
                      <div className="px-6 py-4 bg-[#f9fafb] border-b border-[#333333] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[#6b7280] text-xs font-bold font-mono">#{idx+1}</span>
                          {getSeverityBadge(item.severity)}
                          <h4 className="text-xs font-bold text-black uppercase tracking-wider">{item.claim}</h4>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Chronological Provenance History Timeline */}
                        {item.history && item.history.length > 0 && (
                          <div className="bg-[#f9fafb] border border-[#333333]/20 rounded-2xl p-5 space-y-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                              <Activity className="h-4 w-4 text-[#d37bff]" /> Chronological Claims History
                            </span>
                            
                            <div className="relative border-l border-[#333333] pl-4 ml-1 space-y-4">
                              {item.history.map((hist: any, hIdx: number) => (
                                <motion.div 
                                  key={hIdx} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * hIdx }}
                                  className="relative"
                                >
                                  {/* Dot indicator */}
                                  <div className="absolute -left-[21px] mt-1 h-2.5 w-2.5 rounded-full border border-[#d37bff] bg-white"></div>
                                  <div className="flex items-baseline justify-between gap-2 flex-wrap text-[9px] font-bold text-[#6b7280] uppercase tracking-wider">
                                    <span>{hist.source}</span>
                                    <span>{hist.date}</span>
                                  </div>
                                  <p className="text-xs text-black mt-1 font-mono">{hist.statement}</p>
                                  {hist.code && (
                                    <pre className="mt-1.5 p-2 bg-white border border-[#333333] text-[#fcab83] rounded-2xl font-mono text-[10px] overflow-x-auto">
                                      <code>{hist.code}</code>
                                    </pre>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Outdated Video Claim (Salmon color reserved only for outdated context) */}
                          <div className="bg-[#fcab83]/10 border border-[#fcab83]/40 rounded-2xl p-5 space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                              <Play className="h-3 w-3 shrink-0" /> Old Claim Source
                            </span>
                            <p className="text-xs font-semibold text-black font-mono">
                              {item.history && item.history.length > 0 ? item.history[0].statement : "Claim made in old video."}
                            </p>
                          </div>

                          {/* Current Documentation Truth (Green color reserved only for current docs context) */}
                          <div className="bg-[#9ef58f]/10 border border-[#9ef58f]/40 rounded-2xl p-5 space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-green-700 flex items-center gap-1.5">
                              <CheckCircle className="h-3 w-3 shrink-0" /> Latest Documentation Truth
                          </span>
                            <p className="text-xs font-semibold text-black font-mono">
                              {item.truth}
                            </p>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="bg-[#f9fafb] border border-[#333333] rounded-2xl p-5 space-y-2">
                          <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5 text-[#d37bff]" /> What Changed & Impact
                          </span>
                          <p className="text-xs text-black leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>

                        {/* Code Diff Section */}
                        {(item.oldCode || item.newCode) && (
                          <div className="space-y-3">
                            <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1.5">
                              <Code className="h-3.5 w-3.5 text-[#d37bff]" /> Syntax Migration Diff
                            </span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {item.oldCode && (
                                <div className="bg-[#fcab83]/10 border border-[#fcab83] rounded-2xl overflow-hidden font-mono text-xs">
                                  <div className="bg-[#fcab83]/20 border-b border-[#fcab83] px-4 py-2 text-rose-950 font-bold flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#fcab83] border border-[#333333]"></span> Outdated Code
                                  </div>
                                  <pre className="p-4 text-rose-950 overflow-x-auto whitespace-pre-wrap">
                                    <code>{item.oldCode}</code>
                                  </pre>
                                </div>
                              )}

                              {item.newCode && (
                                <div className="bg-[#9ef58f]/10 border border-[#9ef58f] rounded-2xl overflow-hidden font-mono text-xs">
                                  <div className="bg-[#9ef58f]/20 border-b border-[#9ef58f] px-4 py-2 text-emerald-950 font-bold flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#9ef58f] border border-[#333333]"></span> Correct Code
                                  </div>
                                  <pre className="p-4 text-emerald-950 overflow-x-auto whitespace-pre-wrap">
                                    <code>{item.newCode}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#333333] bg-white py-8 mt-12 text-center text-xs text-[#6b7280] font-bold">
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
