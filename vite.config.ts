import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, ShieldCheck, Zap, BarChart3, ArrowRight, UploadCloud, 
  Brain, FileText, CheckCircle2, ChevronRight, HelpCircle, Star, Users, Briefcase, BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const LandingPage: React.FC = () => {
  const { user, toggleTheme, theme } = useApp();
  const navigate = useNavigate();
  const [sampleResume, setSampleResume] = useState("");
  const [previewAnalyzing, setPreviewAnalyzing] = useState(false);
  const [previewResult, setPreviewResult] = useState<any>(null);

  const handleTestScreen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleResume.trim()) return;
    setPreviewAnalyzing(true);
    setPreviewResult(null);
    setTimeout(() => {
      setPreviewAnalyzing(false);
      setPreviewResult({
        score: 84,
        skills: ["Java", "React", "REST APIs", "MySQL", "Git"],
        missing: ["Spring Boot", "Docker"],
        suggestions: [
          "Incorporate Spring Boot enterprise projects.",
          "Describe your Docker cluster orchestration methodologies."
        ]
      });
    }, 1800);
  };

  const loadSample = () => {
    setSampleResume(
      "IRFAN KHAN - SOFTWARE ENGINEER\n\nContact: irfan@example.com\n\nSUMMARY\nPassionate Java full-stack engineer with 2+ years of experience constructing high-volume web dashboards in React and secure SQL database systems.\n\nSKILLS\nJava, SQL, JavaScript, React, RESTful APIs, Git, Tailwind CSS."
    );
  };

  const faqItems = [
    {
      q: "How does the AI Assisted Screening score resumes?",
      a: "Our advanced intelligence engine cross-compares a candidate's resume keywords, structural project outlines, and certifications against your job listing's specified requiredSkills using semantic mapping, generating a detailed readiness analysis."
    },
    {
      q: "Does it support both PDF and DOCX file types?",
      a: "Yes! The system parses standard document formats (PDF and Word documents) and extracts structured qualifications instantly."
    },
    {
      q: "What role types are supported?",
      a: "We support three separate visual environments: Candidates (to upload profiles and analyze missing skills), Recruiters (to manage pipeline applicants and rank resumes), and Admins (for analytics and user audit logs)."
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-150 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-32 overflow-hidden border-b border-gray-150/60 dark:border-gray-900">
        
        {/* Decorative Ambient Gradient Orbs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px]" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[90px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-12 items-center relative">
          
          {/* Hero Left Intro */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left gap-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/10 text-emerald-600 dark:text-emerald-450 text-xs font-bold font-mono tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI-POWERED CANDIDATE SCREENING V2.5</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight"
            >
              Streamline Hiring with <span className="text-transparent bg-clip-text brand-gradient">Intelligent Resume Screening</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed font-sans"
            >
              Empower your recruitment process. Upload candidate CVs, parse skills using server-side Gemini, rank applicants dynamically by role scores, and automate tracking pipelines in one gorgeous SaaS application.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <Link 
                to={user ? "/dashboard" : "/register"} 
                className="flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/10 brand-gradient hover:brand-gradient-hover transition-all text-sm group"
              >
                <span>Get Started Instantly</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/jobs" 
                className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl text-sm font-semibold hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <span>Browse Open Roles</span>
              </Link>
            </motion.div>

            {/* Micro Creds */}
            <div className="flex items-center gap-6 mt-2 text-xs text-gray-400 font-semibold font-mono">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE JWT AUTH</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-500" /> GEMINI AI PARSING</span>
            </div>
          </div>

          {/* Hero Right - Interactive AI Screen Preview Demo Widget */}
          <div className="md:col-span-5 w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel border border-gray-200/80 dark:border-gray-850 bg-white dark:bg-gray-950 p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 brand-gradient opacity-10 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white leading-none">Instant AI Screener</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Test drive the parser below</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={loadSample}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline"
                >
                  Load Sample Text
                </button>
              </div>

              <form onSubmit={handleTestScreen} className="flex flex-col gap-3">
                <div className="relative">
                  <textarea
                    id="sample-resume-textarea"
                    value={sampleResume}
                    onChange={(e) => setSampleResume(e.target.value)}
                    placeholder="Paste sample resume details here (skills, work history, etc.)..."
                    className="w-full h-28 text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 placeholder-gray-400 resize-none"
                  />
                </div>

                <button
                  id="landing-screener-demo-submit"
                  type="submit"
                  disabled={previewAnalyzing || !sampleResume.trim()}
                  className="w-full flex items-center justify-center gap-2 brand-gradient text-white text-xs font-semibold py-2.5 px-4 rounded-xl disabled:opacity-50 transition-all hover:shadow-md hover:scale-[1.01]"
                >
                  {previewAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Parsing with AI Engine...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Screen Resume Now</span>
                    </>
                  )}
                </button>
              </form>

              {/* Simulated Result Container */}
              <AnimatePresence>
                {previewResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-2 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-900 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Simulated Match Score</span>
                      <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        {previewResult.score}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {previewResult.skills.map((s: string) => (
                        <span key={s} className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/50 dark:text-emerald-400 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
                          ✓ {s}
                        </span>
                      ))}
                      {previewResult.missing.map((s: string) => (
                        <span key={s} className="text-[10px] font-semibold text-red-700 bg-red-50/50 dark:text-red-400 dark:bg-red-950/20 px-2 py-0.5 rounded border border-red-500/10">
                          ✗ {s}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-gray-200/50 dark:border-gray-800 pt-2 flex flex-col gap-1 text-[11px] text-gray-400 font-sans">
                      <p className="font-bold text-gray-600 dark:text-gray-300">Improvement Suggestions:</p>
                      {previewResult.suggestions.map((s: string, idx: number) => (
                        <p key={idx} className="flex items-start gap-1 leading-snug mt-0.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{s}</span>
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="py-12 bg-gray-100/40 dark:bg-gray-900/10 border-b border-gray-150/60 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-display font-black text-emerald-600 dark:text-emerald-400">92%</p>
              <p className="text-xs text-gray-400 font-mono mt-1 font-bold uppercase">Resume Accuracy Rating</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-black text-emerald-600 dark:text-emerald-400">&lt; 3s</p>
              <p className="text-xs text-gray-400 font-mono mt-1 font-bold uppercase">AI Parsing Speed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-black text-emerald-600 dark:text-emerald-400">1,500+</p>
              <p className="text-xs text-gray-400 font-mono mt-1 font-bold uppercase">Successful Matches</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-black text-emerald-600 dark:text-emerald-400">100%</p>
              <p className="text-xs text-gray-400 font-mono mt-1 font-bold uppercase">Responsive UI Layout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Aesthetic Platform Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-display font-black">All the SaaS Features You Need</h2>
          <p className="text-sm text-gray-400 max-w-md">Precision crafted screens, smart algorithms, and responsive pipelines mimicking top enterprise dashboard designs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="glass-panel border border-gray-200/50 dark:border-gray-900 p-6 rounded-2xl bg-white dark:bg-gray-950 flex flex-col gap-4 text-left hover:scale-[1.01] transition-transform">
            <span className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 w-fit">
              <Brain className="w-6 h-6" />
            </span>
            <h3 className="text-lg font-bold">Assisted AI Screenings</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Parse technical resumes automatically using modern AI language models. Extract skills, projects, and work histories with calculated resume scores.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel border border-gray-200/50 dark:border-gray-900 p-6 rounded-2xl bg-white dark:bg-gray-950 flex flex-col gap-4 text-left hover:scale-[1.01] transition-transform">
            <span className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 w-fit">
              <Zap className="w-6 h-6" />
            </span>
            <h3 className="text-lg font-bold">Smart Skill Gap Suggestions</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Receive smart recommendations for profile improvement, including missing skills, portfolio enhancements, and certification advices to boost hiring.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel border border-gray-200/50 dark:border-gray-900 p-6 rounded-2xl bg-white dark:bg-gray-950 flex flex-col gap-4 text-left hover:scale-[1.01] transition-transform">
            <span className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 w-fit">
              <BarChart3 className="w-6 h-6" />
            </span>
            <h3 className="text-lg font-bold">Dynamic Status Timeline</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track candidate status (applied, under review, interview scheduled, selected) via high-fidelity custom visual timeline indicators with feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-20 bg-gray-100/30 dark:bg-gray-900/20 border-t border-b border-gray-150/60 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 flex flex-col items-center gap-3">
            <h2 className="text-3xl font-display font-black">Frequently Answered Questions</h2>
            <p className="text-xs text-gray-400">Everything you need to know about our recruitment system</p>
          </div>
          <div className="flex flex-col gap-4 text-left">
            {faqItems.map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-gray-200/60 dark:border-gray-850 bg-white dark:bg-gray-950 flex flex-col gap-2 shadow-sm">
                <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>{item.q}</span>
                </p>
                <p className="text-xs text-gray-400 leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="rounded-3xl relative overflow-hidden text-center flex flex-col items-center gap-6 py-16 px-6 border border-emerald-500/10 shadow-2xl bg-white dark:bg-gray-950 glass-panel">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[150px] brand-gradient opacity-10 rounded-full blur-3xl" />
          <h2 className="text-3xl md:text-4xl font-display font-black max-w-lg">Ready to experience recruitment at lightspeed?</h2>
          <p className="text-xs text-gray-400 max-w-md">Create an account in seconds, swap dashboards on the fly, and experience fully automated resume screening.</p>
          <Link 
            to={user ? "/dashboard" : "/register"} 
            className="flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl brand-gradient hover:brand-gradient-hover shadow-lg shadow-emerald-500/10 text-sm group"
          >
            <span>Register Free Today</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="border-t border-gray-150/60 dark:border-gray-900 bg-white dark:bg-gray-950/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider font-display">RESUMESCREENING AI</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">
            © 2026 RESUMESCREENING. Built for modern recruitment excellence. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-semibold text-gray-400">
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">SaaS Terms</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Privacy Matrix</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">API Keys</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
