import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { Search, User as UserIcon, Briefcase, FileText, Settings, Shield, Moon, Sun, Laptop, ArrowRight, CornerDownLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, theme, toggleTheme, user, login, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus input on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [commandPaletteOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCommandPaletteOpen(false);
      }
    };
    if (commandPaletteOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [commandPaletteOpen]);

  // Commands list
  const commands = [
    {
      id: "nav_jobs",
      category: "Navigation",
      title: "Browse Open Jobs",
      subtitle: "View active openings, match ratings, and salary parameters",
      icon: <Briefcase className="w-4 h-4 text-sky-500" />,
      action: () => { navigate("/jobs"); setCommandPaletteOpen(false); }
    },
    {
      id: "nav_profile",
      category: "Navigation",
      title: "Go to My Resume Profile",
      subtitle: "Update personal details, education, skills, and projects wizard",
      icon: <UserIcon className="w-4 h-4 text-emerald-500" />,
      action: () => { navigate("/profile"); setCommandPaletteOpen(false); }
    },
    {
      id: "nav_applications",
      category: "Navigation",
      title: "View Applications Feed",
      subtitle: "Track status timelines and active review phases",
      icon: <FileText className="w-4 h-4 text-purple-500" />,
      action: () => { navigate("/applications"); setCommandPaletteOpen(false); }
    },
    // Theme
    {
      id: "toggle_theme",
      category: "Preferences",
      title: `Switch to ${theme === "light" ? "Dark" : "Light"} Mode`,
      subtitle: `Toggle the SaaS UI contrast palette`,
      icon: theme === "light" ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />,
      action: () => { toggleTheme(); setCommandPaletteOpen(false); }
    },
    // Quick role switchers for evaluators
    {
      id: "role_student",
      category: "Quick Role Switcher (For Evaluators)",
      title: "Login as Student/Candidate (Irfan Khan)",
      subtitle: "Access AI analysis circular progress, matched/missing skills, and job list",
      icon: <UserIcon className="w-4 h-4 text-emerald-500 font-bold" />,
      action: () => {
        login("usr_student", {
          id: "usr_student",
          email: "student@resumescreening.ai",
          name: "Irfan Khan",
          role: "student",
          profileCompletePercent: 85,
          avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Irfan"
        });
        navigate("/dashboard");
        setCommandPaletteOpen(false);
      }
    },
    {
      id: "role_recruiter",
      category: "Quick Role Switcher (For Evaluators)",
      title: "Login as Recruiter/HR (Sarah Jenkins)",
      subtitle: "Access recruitment job creator, applicant rank board, and status controls",
      icon: <Shield className="w-4 h-4 text-sky-500 font-bold" />,
      action: () => {
        login("usr_recruiter", {
          id: "usr_recruiter",
          email: "recruiter@resumescreening.ai",
          name: "Sarah Jenkins",
          role: "recruiter",
          profileCompletePercent: 100,
          avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
        });
        navigate("/dashboard");
        setCommandPaletteOpen(false);
      }
    },
    {
      id: "role_admin",
      category: "Quick Role Switcher (For Evaluators)",
      title: "Login as System Admin (Alex Carter)",
      subtitle: "Access complete user management, detailed analytics charts, and activity feeds",
      icon: <Settings className="w-4 h-4 text-red-500 font-bold" />,
      action: () => {
        login("usr_admin", {
          id: "usr_admin",
          email: "admin@resumescreening.ai",
          name: "Alex Carter",
          role: "admin",
          profileCompletePercent: 100,
          avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
        });
        navigate("/dashboard");
        setCommandPaletteOpen(false);
      }
    }
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()) ||
    c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  // Key handlers inside input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div id="command-palette-backdrop" className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-gray-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            ref={containerRef}
            className="w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-900">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                id="command-palette-search-input"
                ref={inputRef}
                type="text"
                placeholder="Search commands, navigate dashboards, or switch roles..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-0 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 text-sm placeholder-gray-400"
              />
              <span className="text-[10px] bg-gray-100 dark:bg-gray-950/40 text-gray-400 px-1.5 py-0.5 rounded border border-gray-200/50 dark:border-gray-850">
                ESC
              </span>
            </div>

            {/* Results Grid */}
            <div className="max-h-[350px] overflow-y-auto p-2 flex flex-col gap-1">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No actions or commands match your query.
                </div>
              ) : (
                filteredCommands.map((command, idx) => {
                  const showCategory = idx === 0 || filteredCommands[idx - 1].category !== command.category;
                  return (
                    <React.Fragment key={command.id}>
                      {showCategory && (
                        <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {command.category}
                        </div>
                      )}
                      <button
                        id={`command-item-${command.id}`}
                        onClick={command.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between text-left p-3 rounded-xl transition-all ${
                          idx === selectedIndex
                            ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            : "text-gray-600 dark:text-gray-450 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${idx === selectedIndex ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}`}>
                            {command.icon}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{command.title}</div>
                            <div className="text-xs text-gray-400 leading-snug">{command.subtitle}</div>
                          </div>
                        </div>
                        {idx === selectedIndex && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                            <span>Select</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Keyboard Shortcuts Footer */}
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-900 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="bg-white dark:bg-gray-950 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-800">↑↓</span> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-white dark:bg-gray-950 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-800">Enter</span> Select
                </span>
              </div>
              <div>
                Press <span className="bg-white dark:bg-gray-950 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-800 font-mono">Ctrl + K</span> to summon palette anywhere
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CommandPalette;
