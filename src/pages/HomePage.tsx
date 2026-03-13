import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileSearch, ShieldAlert, MessageCircleQuestion, Upload, ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: FileSearch,
    title: "AI Legal Document Analysis",
    description: "Deep analysis of contracts, agreements, and legal documents using advanced AI models.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Detection",
    description: "Automatically identify potential risks, unfavorable clauses, and hidden obligations.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask Questions",
    description: "Chat with your documents — get instant answers about any clause or legal term.",
  },
];

const steps = [
  { label: "Upload Document", description: "PDF, JPG, or PNG" },
  { label: "Text Extraction", description: "OCR / PDF parsing" },
  { label: "AI Analysis", description: "Legal AI engine" },
  { label: "Structured Insights", description: "Clear, actionable results" },
];

const HomePage = () => {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 glass border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <span className="text-xl font-bold glow-text">Vani-Kanoon</span>
          <Link to="/analyzer">
            <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
              Open Analyzer
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="glow-text">Vani-Kanoon</span>
            <br />
            <span className="text-foreground">AI Legal Assistant</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Understand complex legal documents in simple language using AI.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link to="/analyzer">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl animate-glow-pulse hover:scale-105 transition-transform"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Document
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            Powerful <span className="glow-text">Features</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass rounded-2xl p-8 glow-border group hover:-translate-y-2 transition-transform duration-300"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            How It <span className="glow-text">Works</span>
          </motion.h2>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i + 1}
              >
                <div className="glass rounded-xl p-6 flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{step.label}</h4>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-5 w-5 text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="glow-text">Analyze</span>?
            </h2>
            <Link to="/analyzer">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground px-10 py-6 text-lg font-semibold rounded-xl animate-glow-pulse hover:scale-105 transition-transform"
              >
                Analyze Your Document
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          © 2026 Vani-Kanoon. AI Legal Assistant.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
