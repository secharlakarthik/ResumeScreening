import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Briefcase, MapPin, Search, ChevronRight, Sparkles, Filter, X, Check, AlertTriangle, Send 
} from "lucide-react";
import { Job, Profile, Application } from "../types";

export const JobsFeed: React.FC = () => {
  const { apiFetch, showToast, user } = useApp();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Slider Drawer for active job details
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobsData();
  }, [user]);

  const fetchJobsData = async () => {
    setLoading(true);
    try {
      const allJobs = await apiFetch("/api/jobs");
      setJobs(allJobs);

      if (user && user.role === "student") {
        const studentProfile = await apiFetch("/api/profile");
        setProfile(studentProfile);

        const apps = await apiFetch("/api/applications");
        setApplications(apps);
      }
    } catch (err) {
      console.error("Failed to load jobs data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      showToast("Please sign in or register to submit applications.", "warning");
      return;
    }
    if (user.role !== "student") {
      showToast("Role override: Only Student Candidate accounts are permitted to apply.", "warning");
      return;
    }

    setApplying(true);
    try {
      await apiFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({ jobId })
      });
      showToast("Application submitted successfully!", "success");
      fetchJobsData();
      setActiveJob(null);
    } catch (err: any) {
      showToast(err.message || "Failed to submit application.", "error");
    } finally {
      setApplying(false);
    }
  };

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesKeyword = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "all" || job.location.includes(selectedLocation);
    return matchesKeyword && matchesLocation;
  });

  // Calculate unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location.split("(")[0].trim())));

  // Calculate readiness match statistics for currently active job
  const getReadinessScore = (job: Job) => {
    if (!profile) return { score: 50, matched: [], missing: job.requiredSkills };
    
    const studentSkills = profile.skills.map(s => s.toLowerCase());
    const matched = job.requiredSkills.filter(s => studentSkills.includes(s.toLowerCase()));
    const missing = job.requiredSkills.filter(s => !studentSkills.includes(s.toLowerCase()));
    
    const score = job.requiredSkills.length > 0 
      ? Math.round((matched.length / job.requiredSkills.length) * 100) 
      : 100;
    
    return { score, matched, missing };
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-mono font-bold">LOADING ACTIVE JOBS BOARD...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[calc(100vh-64px)] text-left">
      
      {/* Page Title */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-display font-black tracking-tight">Browse Open Engineering Roles</h1>
        <p className="text-xs text-gray-400">Discover positions matching your expertise, evaluate your AI readiness parameters, and submit applications instantly.</p>
      </div>

      {/* Filters toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* Search input */}
        <div className="relative sm:col-span-2 text-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles by title, keyword description, tech, or frameworks..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/35 placeholder-gray-400 transition-shadow font-sans"
          />
        </div>

        {/* Location selector */}
        <div className="relative text-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <Filter className="w-4 h-4" />
          </span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/35 text-gray-600 appearance-none cursor-pointer"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Jobs Layout Columns */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left pane: job listings grid */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Briefcase className="w-10 h-10 text-gray-300" />
              <p className="text-sm font-bold">No matching positions found</p>
              <p className="text-xs text-gray-400">Modify your search query or clear location filters to see all active job vacancies.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const alreadyApplied = applications.some(a => a.jobId === job.id);
              const { score } = getReadinessScore(job);
              return (
                <div
                  key={job.id}
                  onClick={() => setActiveJob(job)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 relative text-left bg-white dark:bg-gray-950 ${
                    activeJob?.id === job.id
                      ? "border-emerald-500 ring-2 ring-emerald-500/10 dark:ring-emerald-500/5 shadow-md"
                      : "border-gray-150/60 dark:border-gray-900 hover:border-gray-300 dark:hover:border-gray-800 hover:shadow-sm"
                  }`}
                >
                  {alreadyApplied && (
                    <span className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full font-mono">
                      APPLIED ✓
                    </span>
                  )}
                  
                  <div className="flex flex-col gap-1 pr-16">
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">{job.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-450 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {job.requiredSkills.map((s) => (
                      <span key={s} className="text-[10px] font-bold font-mono bg-gray-55/70 text-gray-650 dark:bg-gray-900 dark:text-gray-400 py-0.5 px-2 rounded-lg border border-gray-150/50 dark:border-gray-850">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-900 pt-3 flex items-center justify-between text-[11px] font-mono mt-1">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-450">{job.salary}</span>
                    {user?.role === "student" && (
                      <span className="font-bold text-gray-400">
                        Readiness: <b className="text-emerald-600">{score}%</b>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right pane: Sliding active details drawer */}
        <div className="md:col-span-1">
          {activeJob ? (
            (() => {
              const { score, matched, missing } = getReadinessScore(activeJob);
              const alreadyApplied = applications.some(a => a.jobId === activeJob.id);
              return (
                <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-gray-850 bg-white dark:bg-gray-950 shadow-2xl relative overflow-hidden flex flex-col gap-5 sticky top-24">
                  <div className="absolute top-0 right-0 w-32 h-32 brand-gradient opacity-[0.03] rounded-full blur-2xl" />
                  
                  <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-900 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Position Specifications</span>
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight mt-1">{activeJob.title}</h3>
                    </div>
                    <button
                      onClick={() => setActiveJob(null)}
                      className="p-1 rounded bg-gray-100 dark:bg-gray-900 text-gray-400 hover:text-gray-650 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3.5 text-xs text-gray-500 leading-relaxed">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0 text-emerald-500" /> <span>{activeJob.location}</span></p>
                    <p className="flex items-center gap-2 font-mono"><span className="text-emerald-500 font-bold">$</span> <span>{activeJob.salary}</span></p>
                    <hr className="border-gray-100 dark:border-gray-900" />
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 mb-1 font-mono">Job Description</p>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{activeJob.description}</p>
                    </div>
                  </div>

                  {/* Smart Readiness Meter Widget */}
                  {user?.role === "student" && (
                    <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-450 uppercase flex items-center gap-1">
                          <Sparkles className="w-4 h-4 animate-bounce" /> Skill Match Rating
                        </span>
                        <span className="text-xs font-black font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          {score}% Ready
                        </span>
                      </div>

                      {/* Matching and missing skills tags list */}
                      <div className="flex flex-col gap-1.5 text-[11px] leading-snug">
                        {matched.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">Has:</span>
                            {matched.map(s => (
                              <span key={s} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-450 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/10">✓ {s}</span>
                            ))}
                          </div>
                        )}
                        {missing.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">Missing:</span>
                            {missing.map(s => (
                              <span key={s} className="text-[10px] font-bold text-red-650 bg-red-50 dark:text-red-400 dark:bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/10">✗ {s}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                            <Check className="w-3.5 h-3.5" /> Perfect skill matchup! Ideal candidate.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apply Actions Buttons */}
                  <div className="mt-2">
                    {alreadyApplied ? (
                      <div className="p-3 text-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                        Application Successfully Filed ✓
                      </div>
                    ) : (
                      <button
                        id="job-apply-submit"
                        disabled={applying}
                        onClick={() => handleApply(activeJob.id)}
                        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 rounded-xl brand-gradient hover:brand-gradient-hover disabled:opacity-50 text-xs shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.01]"
                      >
                        {applying ? "Parsing Profile & Applying..." : "Apply Instantly with Screen Profile"}
                        <Send className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-950 rounded-3xl text-gray-400 text-xs flex flex-col items-center justify-center gap-2 sticky top-24">
              <Briefcase className="w-8 h-8 text-gray-300" />
              <p className="font-bold">No Active Selection</p>
              <p>Click any engineering position on the left grid panel to slide open description files, matching diagnostics, and instant application forms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default JobsFeed;
