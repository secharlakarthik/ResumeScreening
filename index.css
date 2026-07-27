import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Briefcase, Users, FileCheck2, TrendingUp, Sparkles, Filter, Check, X, ArrowRight, MessageSquare, Plus, Edit2, ShieldAlert
} from "lucide-react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Job, Application } from "../types";

export const RecruiterDashboard: React.FC = () => {
  const { apiFetch, showToast } = useApp();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Selector for candidate evaluation panel
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusComment, setStatusComment] = useState("");
  const [pipelineLoading, setPipelineLoading] = useState(false);

  // New Job Creation states inside recruiter modal
  const [newJobOpen, setNewJobOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobSalary, setJobSalary] = useState("$120,000 - $145,000 / year");
  const [jobLocation, setJobLocation] = useState("San Francisco, CA (Hybrid)");
  const [jobSkillsStr, setJobSkillsStr] = useState("Java, Spring Boot, React, REST APIs, MySQL");
  const [jobDesc, setJobDesc] = useState("We are seeking an outstanding engineer to spearhead SaaS microservice features.");

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    setLoading(true);
    try {
      const allJobs = await apiFetch("/api/jobs");
      setJobs(allJobs);

      const allApps = await apiFetch("/api/applications");
      setApplications(allApps);
    } catch (err) {
      console.error("Failed to load recruiter data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc) {
      showToast("Please supply a job title and description.", "warning");
      return;
    }
    try {
      const skills = jobSkillsStr.split(",").map(s => s.trim()).filter(Boolean);
      await apiFetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          title: jobTitle,
          description: jobDesc,
          requiredSkills: skills,
          location: jobLocation,
          salary: jobSalary,
          deadline: "2026-12-31"
        })
      });
      showToast("New job posting registered successfully!", "success");
      setNewJobOpen(false);
      // Reset
      setJobTitle("");
      setJobDesc("");
      fetchRecruiterData();
    } catch (err) {
      showToast("Failed to register job listing.", "error");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedApp) return;
    setPipelineLoading(true);
    try {
      const updated = await apiFetch(`/api/applications/${selectedApp.id}/status`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          comment: statusComment || `Moved pipeline status to ${status.replace("_", " ")}.`
        })
      });
      showToast("Candidate hiring status successfully transition!", "success");
      setStatusComment("");
      setSelectedApp(null);
      fetchRecruiterData();
    } catch (err: any) {
      showToast(err.message || "Pipeline transition failed.", "error");
    } finally {
      setPipelineLoading(false);
    }
  };

  // Recharts: Pipeline Funnel counts
  const stageStats = [
    { name: "APPLIED", count: applications.filter(a => a.status === "applied").length, fill: "#9ca3af" },
    { name: "UNDER REVIEW", count: applications.filter(a => a.status === "under_review").length, fill: "#f59e0b" },
    { name: "SHORTLISTED", count: applications.filter(a => a.status === "shortlisted").length, fill: "#3b82f6" },
    { name: "INTERVIEWS", count: applications.filter(a => a.status === "interview_scheduled").length, fill: "#6366f1" },
    { name: "HIRED", count: applications.filter(a => a.status === "selected").length, fill: "#10b981" },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-mono font-bold">LOADING HR/RECRUITER WORKSPACE...</p>
      </div>
    );
  }

  // Rank candidate listings by highest score first
  const sortedApplicants = [...applications].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Intro & Top toolbar row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight flex items-center gap-2">
            <span>Recruiter workspace</span>
            <Sparkles className="w-5 h-5 text-sky-500" />
          </h1>
          <p className="text-xs text-gray-400">Post active listings, oversee candidate matches, transition pipeline statuses, and review AI assessments.</p>
        </div>
        <button
          id="recruiter-post-job-btn"
          onClick={() => setNewJobOpen(true)}
          className="w-fit text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post a New Job</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-sky-500" /> Active Job Postings
          </span>
          <span className="text-3xl font-display font-black mt-2">{jobs.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Accepting CV submissions</p>
        </div>

        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" /> Total Applications
          </span>
          <span className="text-3xl font-display font-black mt-2">{applications.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Unique CVs parsed</p>
        </div>

        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" /> High-Match Candidates
          </span>
          <span className="text-3xl font-display font-black mt-2">
            {applications.filter(a => a.matchScore >= 80).length}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Match rating &gt;= 80%</p>
        </div>

        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Interview Rate
          </span>
          <span className="text-3xl font-display font-black mt-2">
            {applications.length > 0 
              ? `${Math.round((applications.filter(a => a.status === "interview_scheduled" || a.status === "selected").length / applications.length) * 100)}%` 
              : "0%"}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Of total candidate funnel</p>
        </div>
      </div>

      {/* Main split sections */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Col: Jobs list & Analytics bar chart */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          {/* List of Active Roles */}
          <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Active Job Postings ({jobs.length})</h3>
            <div className="flex flex-col gap-2.5">
              {jobs.map((job) => (
                <div key={job.id} className="p-3 border border-gray-100 dark:border-gray-900 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all flex flex-col gap-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{job.title}</p>
                  <p className="text-[10px] text-gray-400 truncate">{job.location} • {job.salary}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {job.requiredSkills.slice(0, 3).map((s) => (
                      <span key={s} className="text-[8px] font-bold font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-[8px] font-bold text-gray-400 px-1 py-0.5">+ {job.requiredSkills.length - 3} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline funnels stats chart */}
          <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Hiring Pipeline Funnel Distributions</h3>
            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageStats} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={8} allowDecimals={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "10px", color: "#fff" }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Ranked applicants table with detailed interactive modal evaluations */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Candidates rankings list board */}
          <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Candidate Rank Board (Sorted by Match Scores)</h3>
            
            {sortedApplicants.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-12">No candidate applications submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-900 text-[10px] font-bold text-gray-400 uppercase font-mono">
                      <th className="pb-2.5">Candidate</th>
                      <th className="pb-2.5">Target Job Role</th>
                      <th className="pb-2.5 text-center">AI Rating</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right">Review Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/50 dark:divide-gray-900/50 text-xs">
                    {sortedApplicants.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                        <td className="py-3 font-semibold text-gray-900 dark:text-white">{app.studentName}</td>
                        <td className="py-3 text-gray-500 max-w-[150px] truncate">{app.jobTitle}</td>
                        <td className="py-3 text-center">
                          <span className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                            app.matchScore >= 80 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" :
                            app.matchScore >= 60 ? "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400" :
                            "bg-amber-50 text-amber-600 dark:bg-amber-950/40"
                          }`}>
                            {app.matchScore}%
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase ${
                            app.status === "selected" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400" :
                            app.status === "rejected" ? "bg-red-100 text-red-800" :
                            app.status === "interview_scheduled" ? "bg-indigo-100 text-indigo-800" :
                            "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                          }`}>
                            {app.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            id={`recruiter-review-candidate-${app.id}`}
                            onClick={() => {
                              setSelectedApp(app);
                              setStatusComment("");
                            }}
                            className="text-[10px] font-bold text-sky-600 dark:text-sky-450 hover:underline"
                          >
                            Transition Pipeline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Floating evaluation / pipeline details panel */}
          {selectedApp && (
            <div className="p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 relative overflow-hidden flex flex-col gap-4">
              <div className="absolute top-0 right-0 w-32 h-32 brand-gradient opacity-5 rounded-full blur-2xl" />
              
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">Active Evaluation & Candidate Diagnostics</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Reviewing <b>{selectedApp.studentName}</b> for <b>{selectedApp.jobTitle}</b></p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded bg-gray-100 dark:bg-gray-900 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Match diagnostic tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed">
                <div className="p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-900 flex flex-col gap-1">
                  <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase">MATCH SCORE</span>
                  <span className="text-xl font-display font-black text-emerald-600 dark:text-emerald-450">{selectedApp.matchScore}% Match</span>
                </div>
                <div className="p-3 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-900 flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">Matched Technical Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedApp.matchedSkills?.map((s) => (
                      <span key={s} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">✓ {s}</span>
                    ))}
                    {selectedApp.missingSkills?.map((s) => (
                      <span key={s} className="text-[9px] bg-red-50 text-red-650 px-1.5 py-0.5 rounded">✗ {s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback status timeline update form */}
              <div className="flex flex-col gap-2 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-4 rounded-xl">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Evaluate Status Comment</label>
                <textarea
                  id="recruiter-comment-input"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Incorporate interview logs, screening notes, or missing credentials feedback..."
                  className="w-full text-xs p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 focus:outline-none placeholder-gray-400 resize-none h-20"
                />

                <div className="flex items-center gap-2 flex-wrap mt-2">
                  <button
                    id="recruiter-btn-under-review"
                    onClick={() => handleUpdateStatus("under_review")}
                    className="text-[10px] font-bold py-1.5 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-350 rounded-lg"
                  >
                    Set Under Review
                  </button>
                  <button
                    id="recruiter-btn-shortlist"
                    onClick={() => handleUpdateStatus("shortlisted")}
                    className="text-[10px] font-bold py-1.5 px-3 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 rounded-lg"
                  >
                    Shortlist
                  </button>
                  <button
                    id="recruiter-btn-schedule"
                    onClick={() => handleUpdateStatus("interview_scheduled")}
                    className="text-[10px] font-bold py-1.5 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg"
                  >
                    Invite to Interview
                  </button>
                  <button
                    id="recruiter-btn-select"
                    onClick={() => handleUpdateStatus("selected")}
                    className="text-[10px] font-bold py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg"
                  >
                    Hire Candidate
                  </button>
                  <button
                    id="recruiter-btn-reject"
                    onClick={() => handleUpdateStatus("rejected")}
                    className="text-[10px] font-bold py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-lg"
                  >
                    Reject CV
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Job Creation Overlay Modal */}
      {newJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-150 dark:border-gray-900 p-6 bg-white dark:bg-gray-950 shadow-2xl relative">
            <h3 className="text-base font-extrabold mb-4">Post a Job Workspace Listing</h3>
            <form onSubmit={handleCreateJob} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Job Title / Role Name</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Principal Java Developer"
                  className="p-2.5 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold">Location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="p-2.5 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold">Salary Bracket</label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    className="p-2.5 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={jobSkillsStr}
                  onChange={(e) => setJobSkillsStr(e.target.value)}
                  placeholder="Java, React, SQL, Spring Boot"
                  className="p-2.5 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold">Description Overview</label>
                <textarea
                  required
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="p-2.5 border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 resize-none h-20"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setNewJobOpen(false)}
                  className="py-2 px-4 rounded-xl border border-gray-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 font-bold"
                >
                  Post Active Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default RecruiterDashboard;
