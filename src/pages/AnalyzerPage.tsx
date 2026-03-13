import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import {
  Upload, FileText, ShieldAlert, Users, Lightbulb, Volume2, VolumeX,
  Send, ArrowLeft, Bot, User, CloudUpload, FileCheck, Sparkles, Scan,
  CheckCircle2, X, File
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  }),
};

const mockAnalysis = {
  explanation:
    "This is a residential lease agreement between a landlord and tenant for a property located in Mumbai. The agreement spans 11 months with a monthly rent of ₹25,000. It includes standard clauses about security deposit, maintenance responsibilities, and termination conditions.",
  keyPoints: [
    "Lease duration: 11 months starting from March 2026",
    "Monthly rent: ₹25,000 with 5% annual increment",
    "Security deposit: ₹75,000 (3 months rent)",
    "Maintenance charges borne by tenant",
    "30-day notice period for termination by either party",
  ],
  parties: [
    { role: "Landlord", name: "Mr. Rajesh Kumar" },
    { role: "Tenant", name: "Ms. Priya Sharma" },
    { role: "Witness", name: "Mr. Anil Verma" },
  ],
  risks: [
    "No clause for natural disaster or force majeure events",
    "Penalty clause for early termination favors the landlord",
    "No mention of dispute resolution mechanism",
    "Vague maintenance responsibility definitions",
  ],
};

const sampleResponses: Record<string, string> = {
  default:
    "I can help you understand this document. Try asking about specific clauses, parties involved, or potential risks.",
  property:
    "Based on the document analysis, this is a lease agreement — you do not own the property. You are the tenant with rights to occupy the property for the lease duration of 11 months.",
  risky:
    "There are some risks identified: no force majeure clause, the early termination penalty favors the landlord, and maintenance responsibilities are vaguely defined. I'd recommend negotiating clearer terms.",
  tenant:
    "If the tenant breaks the agreement before the 11-month period, the security deposit of ₹75,000 may be forfeited as per the penalty clause. A 30-day written notice is required.",
};

function getChatResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("own") || lower.includes("property")) return sampleResponses.property;
  if (lower.includes("risk") || lower.includes("risky")) return sampleResponses.risky;
  if (lower.includes("tenant") || lower.includes("break")) return sampleResponses.tenant;
  return sampleResponses.default;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Analyzing animation component
const AnalyzingOverlay = ({ progress }: { progress: number }) => {
  const stages = [
    { icon: Scan, label: "Extracting text...", threshold: 0 },
    { icon: FileCheck, label: "Parsing document structure...", threshold: 25 },
    { icon: Sparkles, label: "Running AI analysis...", threshold: 55 },
    { icon: CheckCircle2, label: "Generating insights...", threshold: 80 },
  ];

  const currentStage = stages.filter(s => progress >= s.threshold).length - 1;

  return (
    <motion.div
      className="mt-8 glass rounded-2xl p-10 glow-border overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background scan line */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, hsl(175 80% 50% / 0.03) 50%, transparent 100%)",
        }}
        animate={{ y: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>
        <h3 className="text-xl font-semibold">Analyzing Document</h3>
        <p className="text-muted-foreground text-sm mt-1">AI is processing your document...</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(175 80% 50%), hsl(260 60% 55%))",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-right text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
      </div>

      {/* Steps */}
      <div className="space-y-3 max-w-sm mx-auto">
        {stages.map((stage, i) => {
          const isActive = i === currentStage;
          const isDone = i < currentStage;
          return (
            <motion.div
              key={stage.label}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive ? "glass border border-primary/30" : isDone ? "opacity-60" : "opacity-30"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isDone ? 0.6 : isActive ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              ) : isActive ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <stage.icon className="h-5 w-5 text-primary shrink-0" />
                </motion.div>
              ) : (
                <stage.icon className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map(d => (
                    <motion.div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, delay: d * 0.2, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const AnalyzerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    onDrop: (files) => {
      if (files[0]) {
        setFile(files[0]);
        setAnalyzed(false);
        setAnalyzing(false);
        setAnalyzeProgress(0);
        setChatMessages([]);
      }
    },
  });

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalyzeProgress(0);
  };

  useEffect(() => {
    if (!analyzing) return;
    const interval = setInterval(() => {
      setAnalyzeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setAnalyzing(false);
            setAnalyzed(true);
          }, 400);
          return 100;
        }
        // Variable speed for realism
        const increment = prev < 25 ? 3 : prev < 55 ? 2 : prev < 80 ? 1.5 : 4;
        return Math.min(prev + increment, 100);
      });
    }, 80);
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleRemoveFile = () => {
    setFile(null);
    setAnalyzed(false);
    setAnalyzing(false);
    setAnalyzeProgress(0);
    setChatMessages([]);
  };

  const handleSpeak = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(mockAnalysis.explanation);
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput };
    const botMsg: ChatMessage = { role: "assistant", content: getChatResponse(chatInput) };
    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const sections = [
    { icon: Lightbulb, title: "Simple Explanation", content: mockAnalysis.explanation, color: "text-primary" },
    {
      icon: FileText, title: "Key Points", color: "text-secondary",
      content: (
        <ul className="space-y-2">
          {mockAnalysis.keyPoints.map((p, i) => (
            <li key={i} className="flex gap-2 text-muted-foreground">
              <span className="text-primary mt-1">•</span> {p}
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: Users, title: "Important Parties", color: "text-primary",
      content: (
        <div className="space-y-2">
          {mockAnalysis.parties.map((p, i) => (
            <div key={i} className="flex justify-between glass rounded-lg px-4 py-2">
              <span className="text-muted-foreground">{p.role}</span>
              <span className="font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: ShieldAlert, title: "Risks & Warnings", color: "text-destructive",
      content: (
        <ul className="space-y-2">
          {mockAnalysis.risks.map((r, i) => (
            <li key={i} className="flex gap-2 text-muted-foreground">
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-1" /> {r}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const fileIcon = file?.type === "application/pdf" ? FileText : File;
  const FileIcon = fileIcon;

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 glass border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xl font-bold glow-text">Vani-Kanoon</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto pt-28 pb-20 px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            Document <span className="glow-text">Analyzer</span>
          </h1>
          <p className="text-muted-foreground mt-2">Upload a legal document and let AI break it down for you</p>
        </motion.div>

        {/* Upload area */}
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div
                {...getRootProps()}
                className={`relative rounded-2xl p-16 text-center cursor-pointer border-2 border-dashed transition-all duration-500 group overflow-hidden
                  ${isDragActive
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border/50 hover:border-primary/50 glass"
                  }`}
              >
                <input {...getInputProps()} />

                {/* Animated corner accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-lg group-hover:border-primary/60 transition-colors" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary/30 rounded-tr-lg group-hover:border-primary/60 transition-colors" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary/30 rounded-bl-lg group-hover:border-primary/60 transition-colors" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-lg group-hover:border-primary/60 transition-colors" />

                <motion.div
                  animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/15 transition-colors">
                    <CloudUpload className="h-10 w-10 text-primary" />
                  </div>
                </motion.div>

                <p className="text-xl font-semibold mb-2">
                  {isDragActive ? "Drop your document here" : "Upload your legal document"}
                </p>
                <p className="text-muted-foreground mb-6">
                  Drag & drop or click to browse your files
                </p>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  {[
                    { label: "PDF", color: "bg-destructive/20 text-destructive" },
                    { label: "JPG", color: "bg-primary/20 text-primary" },
                    { label: "PNG", color: "bg-secondary/20 text-secondary" },
                  ].map(f => (
                    <span key={f.label} className={`px-3 py-1 rounded-full font-mono font-medium ${f.color}`}>
                      .{f.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : !analyzing && !analyzed ? (
            <motion.div
              key="file-info"
              className="glass rounded-2xl p-8 glow-border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileIcon className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">{file.name}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • {file.type.split("/")[1]?.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:scale-105 transition-transform animate-glow-pulse gap-2 px-6"
                  >
                    <Sparkles className="h-4 w-4" />
                    Analyze Document
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Analyzing animation */}
        <AnimatePresence>
          {analyzing && <AnalyzingOverlay progress={analyzeProgress} />}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {analyzed && (
            <motion.div className="mt-10 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Top bar: re-upload + voice */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleRemoveFile}
                  className="border-border/50 text-muted-foreground hover:text-foreground gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload New
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSpeak}
                  className="border-primary/40 text-primary hover:bg-primary/10 gap-2"
                >
                  {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {speaking ? "Stop" : "Listen Explanation"}
                </Button>
              </div>

              {sections.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="glass rounded-2xl p-8 glow-border"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                  </div>
                  <div className="text-muted-foreground leading-relaxed">
                    {typeof s.content === "string" ? <p>{s.content}</p> : s.content}
                  </div>
                </motion.div>
              ))}

              {/* Chat */}
              <motion.div
                className="glass rounded-2xl p-8 glow-border"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={sections.length}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Ask About This Document</h3>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm">Try asking:</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {["Do I own this property?", "Is this contract risky?", "What if the tenant breaks the agreement?"].map((q) => (
                          <button
                            key={q}
                            onClick={() => setChatInput(q)}
                            className="text-xs glass rounded-full px-4 py-2 text-primary hover:bg-primary/10 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "glass"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-secondary" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="Ask a question about your document..."
                    className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <Button
                    onClick={handleSendChat}
                    className="bg-primary text-primary-foreground rounded-xl px-4 hover:scale-105 transition-transform"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyzerPage;
