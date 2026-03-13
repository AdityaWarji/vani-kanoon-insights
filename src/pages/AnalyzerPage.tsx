import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import {
  Upload, FileText, ShieldAlert, Users, Lightbulb, Volume2, VolumeX,
  Send, ArrowLeft, Bot, User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  }),
};

// Mock analysis results
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

const AnalyzerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
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
        setChatMessages([]);
      }
    },
  });

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
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
        {/* Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div
            {...getRootProps()}
            className={`glass rounded-2xl p-10 text-center cursor-pointer border-2 border-dashed transition-all duration-300
              ${isDragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40 hover:bg-card/80"}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">
              {isDragActive ? "Drop your document here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-muted-foreground text-sm mt-2">Supports PDF, JPG, PNG</p>
          </div>
        </motion.div>

        {/* File info */}
        {file && !analyzed && (
          <motion.div
            className="mt-6 glass rounded-xl p-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-primary text-primary-foreground hover:scale-105 transition-transform"
            >
              {analyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {analyzed && (
            <motion.div className="mt-10 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Voice button */}
              <div className="flex justify-end">
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
                            onClick={() => {
                              setChatInput(q);
                            }}
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
