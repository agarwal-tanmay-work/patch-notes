"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  ChevronRight, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft,
  Info,
  Clock,
  Terminal,
  ShieldCheck,
  FileCode,
  Gauge
} from "lucide-react";

// Demo data presets
const DEMO_PRESETS = [
  {
    name: "React Router v6 Redirects",
    description: "Compare obsolete v5 style Redirect component with v6 Navigate and useNavigate hook.",
    videoUrl: "https://www.youtube.com/watch?v=y881t8ilMyc",
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
\`\`\``
  },
  {
    name: "Next.js Navigation (App Router)",
    description: "Compare Pages Router 'next/router' with App Router 'next/navigation' requirements.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
\`\`\``
  },
  {
    name: "Supermemory JS SDK",
    description: "Compare older client.memories.add signature with the modern client.add signature.",
    videoUrl: "https://www.youtube.com/watch?v=t705574H-A0",
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
\`\`\``
  }
];

export default function Home() {
  // Navigation & Page State
  const [step, setStep] = useState<"input" | "loading" | "compare">("input");
  
  // Ingestion Input Form
  const [videoUrl, setVideoUrl] = useState("");
  const [docText, setDocText] = useState("");
  const [topicName, setTopicName] = useState("");
  
  // Ingestion Response & Polling
  const [topicId, setTopicId] = useState("");
  const [pollingStatus, setPollingStatus] = useState<string>("Initializing...");
  const [videoStatus, setVideoStatus] = useState<"queued" | "done" | "failed" | "processing">("queued");
  const [docStatus, setDocStatus] = useState<"queued" | "done" | "failed" | "processing">("queued");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Comparison Results
  const [summary, setSummary] = useState("");
  const [compatibilityScore, setCompatibilityScore] = useState<number>(100);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");

  // Load a preset
  const loadPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setVideoUrl(preset.videoUrl);
    setDocText(preset.docText);
    setTopicName(preset.name);
  };

  // Start Ingestion
  const handleStartIngestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !docText) {
      setErrorMessage("Please provide both a YouTube URL and Documentation text.");
      return;
    }
    
    setErrorMessage("");
    setStep("loading");
    setPollingStatus("Submitting documents to Supermemory Local...");
    setVideoStatus("queued");
    setDocStatus("queued");

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, docText, topicName }),
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setTopicId(data.topicId);
      setPollingStatus("Documents queued. Starting background analysis...");
      
      // Start polling
      startPolling(data.topicId);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setStep("input");
    }
  };

  // Poll `/api/status`
  const startPolling = (tid: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) { // 1 minute timeout
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
        const videoDoc = memories.find((m: any) => m.type === "video");
        const textDoc = memories.find((m: any) => m.type === "text" || m.type === "document");

        // Update status states
        if (videoDoc) {
          setVideoStatus(videoDoc.status);
        }
        if (textDoc) {
          setDocStatus(textDoc.status);
        }

        // If both are done, trigger comparison
        if (videoDoc?.status === "done" && textDoc?.status === "done") {
          clearInterval(interval);
          setPollingStatus("Graph construction completed! Launching delta comparison...");
          await fetchComparison(tid);
        } else if (videoDoc?.status === "failed" || textDoc?.status === "failed") {
          clearInterval(interval);
          setErrorMessage("Failed to process one or both documents in Supermemory Local.");
          setStep("input");
        } else {
          setPollingStatus("Transcribing video contents & indexing documentation graph...");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);
  };

  // Fetch Comparison
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
      setStep("compare");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate comparison.");
      setStep("input");
    }
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              
              {/* Form Input fields */}
              <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 md:p-8 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-zinc-900 pb-3">
                  <Terminal className="h-4 w-4 text-violet-400" /> Start Analysis
                </h2>
                <form onSubmit={handleStartIngestion} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                      <Play className="h-4 w-4 text-rose-400" /> YouTube Tutorial Video URL
                    </label>
                    <input 
                      type="url"
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-violet-400" /> Current Documentation (Markdown / Text)
                    </label>
                    <textarea 
                      placeholder="Paste the current official docs or API references here..."
                      value={docText}
                      onChange={(e) => setDocText(e.target.value)}
                      rows={8}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">
                      Topic Name (Optional)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. React Router v6 Migrations"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
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
                    Click a preset to quickly fill the form and test the analysis pipeline without finding your own video and text.
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
                    <Info className="h-4 w-4 text-violet-400" /> Under the Hood
                  </h4>
                  <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                    <li>Indexes video url dynamically into local instance.</li>
                    <li>Saves documentation markdown chunks.</li>
                    <li>Links items in the same containerTag.</li>
                    <li>Extracts delta claims via semantic search.</li>
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

            {/* Ingestion Steps */}
            <div className="border-t border-zinc-900 pt-6 space-y-4 text-left">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
                <span className="text-sm flex items-center gap-2 font-medium">
                  <Play className="h-4 w-4 text-rose-400" /> Tutorial Video Indexing
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 capitalize">
                  {videoStatus === "done" && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                  {videoStatus === "queued" && <Clock className="h-3 w-3 text-zinc-500 animate-spin" />}
                  {videoStatus === "failed" && <AlertTriangle className="h-3 w-3 text-rose-500" />}
                  {videoStatus}
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
                  {docStatus}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              Depending on model load and video length, transcription processing can take up to 30 seconds.
            </p>
          </div>
        )}

        {/* STEP 3: COMPARISON VIEW */}
        {step === "compare" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Bar with Go Back */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setStep("input")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Start Over
              </button>
              <div className="text-xs text-zinc-400 font-mono">
                Topic Tag: {topicId}
              </div>
            </div>

            {/* Score & Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Score card */}
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-sm font-bold text-zinc-400 tracking-wider uppercase">Compatibility Score</span>
                <div className={`h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(compatibilityScore)}`}>
                  <Gauge className="h-6 w-6 opacity-60 mb-0.5" />
                  <span className="text-2xl font-extrabold">{compatibilityScore}%</span>
                </div>
                <span className="text-xs text-zinc-400">
                  {compatibilityScore >= 90 ? "Excellent. The video claims align with documentation." : 
                   compatibilityScore >= 70 ? "Warning. Several deprecated methods were noticed." : 
                   "Critical. Outdated claims will cause compile errors."}
                </span>
              </div>

              {/* Summary card */}
              <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-200 mb-2 flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-violet-400" /> Comparison Summary
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {summary}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-xs border-t border-zinc-900 pt-4 text-zinc-400">
                  <span><strong>Total Issues:</strong> {comparisons.length}</span>
                  <span><strong>High Severity:</strong> {comparisons.filter(c => c.severity === "high").length}</span>
                </div>
              </div>

            </div>

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
              <button 
                onClick={() => setActiveSeverityFilter("low")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  activeSeverityFilter === "low" ? "bg-blue-600 text-white border-blue-500" : "bg-transparent border-zinc-900 text-zinc-400 hover:border-zinc-800"
                }`}
              >
                Info ({comparisons.filter(c => c.severity === "low").length})
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
                  <div key={idx} className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
                    
                    {/* Header bar of comparison */}
                    <div className="px-6 py-4 bg-zinc-900/40 border-b border-zinc-900 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 text-xs font-bold font-mono">#{idx+1}</span>
                        {getSeverityBadge(item.severity)}
                      </div>
                    </div>

                    {/* Side-by-side comparison body */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Video Claim */}
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-5 space-y-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                            <Play className="h-3 w-3 shrink-0" /> Tutorial Video Claim
                          </span>
                          <p className="text-sm font-semibold text-zinc-200">
                            {item.claim}
                          </p>
                        </div>

                        {/* Documentation Truth */}
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5 space-y-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle className="h-3 w-3 shrink-0" /> Current Documentation Truth
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
        <p>© 2026 Patch Notes. Powered by Supermemory Local Server and Gemini 1.5 Flash.</p>
      </footer>
    </div>
  );
}
