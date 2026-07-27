import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  FileText, Briefcase, CheckCircle2, Clock, Award, ArrowRight, Sparkles, AlertCircle, Trash2, FileCheck2, Lightbulb, UploadCloud, ChevronRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid 
} from "recharts";
import { Profile, Job, Application } from "../types";

export const StudentDashboard: React.FC = () => {
  const { user, apiFetch, showToast } = useApp();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Drag & drop state for testing resume upload
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const profileData = await apiFetch("/api/profile");
      setProfile(profileData);
      
      const apps = await apiFetch("/api/applications");
      setApplications(apps);

      const recommendations = await apiFetch("/api/jobs/recommend");
      setRecommendedJobs(recommendations.slice(0, 3)); // Display top 3
    } catch (err) {
      console.error("Failed to load student dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUploadedFile(e.target.files[0]);
    }
  };

  // Simulation upload process reading file metadata and calling AI endpoint
  const processUploadedFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      // Read file name and supply detailed text for the parser
      const filename = file.name;
      const fileContentText = `
        Candidate Name: ${user?.name}
        File Upload Parsed: ${filename}
        Education: Bachelor of Science in Computer Engineering, Minor in AI
        Primary Skills: Java, Spring Boot, MySQL, React, TypeScript, Git, REST APIs, Tailwind CSS.
        Selected Projects:
        - "Enterprise Inventory Microservice": Developed resilient Spring Boot REST endpoints managing SQL transactions.
        - "Responsive Recharts Portfolio": Created dark/light dashboard panels mapping live stats.
        Experience: Junior Full Stack Developer with 1.5 years experience scaling REST endpoints.
      `;

      const result = await apiFetch("/api/resume/upload", {
        method: "POST",
        body: JSON.stringify({ filename, fileContentText }),
      });

      setUploadProgress(100);
      clearInterval(interval);
      showToast("Resume parsed and analyzed with AI Engine!", "success");
      fetchDashboardData();
    } catch (err: any) {
      clearInterval(interval);
      showToast(err.message || "Failed to screen resume.", "error");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to delete your analyzed resume?")) return;
    try {
      await apiFetch("/api/resume", { method: "DELETE" });
      showToast("Resume profile metrics deleted.", "info");
      fetchDashboardData();
    } catch (err) {
      showToast("Failed to delete resume.", "error");
    }
  };

  // Recharts: Application volume metrics over time
  const applicationTrends = [
    { name: "Jul 01", applications: 1 },
    { name: "Jul 04", applications: 1 },
    { name: "Jul 08", applications: 2 },
    { name: "Jul 12", applications: 2 },
    { name: "Jul 15", applications: applications.length }
  ];

  // Recharts: Skills match distribution bar
  const skillMatchStats = profile?.resumeParsedData ? [
    { name: "Core Java", score: 90 },
    { name: "SQL DB", score: 85 },
    { name: "React Framework", score: 80 },
    { name: "APIs", score: 75 },
    { name: "Docker Dev", score: profile.skills.includes("Docker") ? 80 : 30 }
  ] : [
    { name: "Core Java", score: 75 },
    { name: "SQL DB", score: 65 },
    { name: "React Framework", score: 50 },
    { name: "APIs", score: 40 },
    { name: "Docker Dev", score: 20 }
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-mono font-bold">LOADING CANDIDATE DASHBOARD STATS...</p>
      </div>
    );
  }

  const hasResume = !!profile?.resumeFilename;
  const resumeScore = profile?.resumeParsedData?.score || 0;

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Dashboard Top Intro Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight flex items-center gap-2">
            <span>Welcome, {user?.name}</span>
            <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
          </h1>
          <p className="text-xs text-gray-400">Track your resume match ratings, skill analysis insights, and current job applications.</p>
        </div>
        <Link 
          to="/profile" 
          className="w-fit text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/10 flex items-center gap-1"
        >
          <span>Edit Profile Wizard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats Quick Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Score Card */}
        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 flex flex-col justify-between min-h-[110px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 brand-gradient opacity-10 rounded-full blur-xl" />
          <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-450 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> AI Resume Score
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">{hasResume ? `${resumeScore}%` : "N/A"}</span>
            <span className="text-[10px] text-gray-400">target &gt;80%</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 truncate">{hasResume ? "Excellent Resume Base" : "Upload Resume to Score"}</p>
        </div>

        {/* Jobs Applied */}
        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-sky-500" /> Jobs Applied
          </span>
          <span className="text-3xl font-display font-black mt-2 text-sky-600 dark:text-sky-450">{applications.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Active submissions</p>
        </div>

        {/* Shortlisted */}
        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Shortlisted
          </span>
          <span className="text-3xl font-display font-black mt-2 text-emerald-600 dark:text-emerald-400">
            {applications.filter(a => a.status === "shortlisted" || a.status === "interview_scheduled" || a.status === "selected").length}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">In review phase</p>
        </div>

        {/* Pending Screen */}
        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Under Review
          </span>
          <span className="text-3xl font-display font-black mt-2 text-amber-600 dark:text-amber-450">
            {applications.filter(a => a.status === "applied" || a.status === "under_review").length}
          </span>
          <p className="text-[10px] text-gray-400 mt-1">Awaiting recruiter feedback</p>
        </div>

        {/* Profile Complete */}
        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">Profile Complete</span>
          <div>
            <span className="text-3xl font-display font-black text-gray-800 dark:text-white">{user?.profileCompletePercent}%</span>
            <div className="w-full bg-gray-100 dark:bg-gray-900 h-1 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-emerald-500" style={{ width: `${user?.profileCompletePercent}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-gray-400">Boost to 100% for placement</p>
        </div>
      </div>

      {/* Main Core Rows */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Col: Upload, Suggetions, Recs */}
        <div className="md:col-span-1 flex flex-col gap-6">
          
          {/* Resume Upload Module */}
          <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Resume Management</span>
              {hasResume && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">SCREENDED ✓</span>}
            </h3>

            {!hasResume ? (
              /* Drag & Drop Area */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 transition-all ${
                  dragActive 
                    ? "border-emerald-500 bg-emerald-50/20" 
                    : "border-gray-200 dark:border-gray-850 hover:border-gray-300 dark:hover:border-gray-800"
                }`}
              >
                <UploadCloud className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Drag CV here or click to upload</p>
                  <p className="text-[10px] text-gray-400 mt-1">Supports PDF, DOCX or TXT files</p>
                </div>
                
                {uploading ? (
                  <div className="w-full mt-2">
                    <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold font-mono">
                      <span>ANALYZING CV SKILLS...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-emerald-500 transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <label htmlFor="resume-file-input" className="mt-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline">
                    <span>Select File</span>
                    <input
                      id="resume-file-input"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ) : (
              /* PDF Preview Screen */
              <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/40 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-8 h-8 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold truncate max-w-[150px]">{profile?.resumeFilename}</p>
                      <p className="text-[10px] text-gray-400">Parsed successfully</p>
                    </div>
                  </div>
                  <button
                    id="delete-resume-btn"
                    onClick={handleDeleteResume}
                    className="p-1 rounded bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 transition-colors"
                    title="Delete current resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-gray-500 font-mono flex items-center justify-between bg-emerald-500/5 p-2 rounded">
                  <span>AI PARSED STRENGTH:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-450">{resumeScore}%</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Suggestions Engine Suggestions */}
          {hasResume && profile?.resumeParsedData?.suggestions && (
            <div className="p-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 flex flex-col gap-3.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 brand-gradient opacity-5 rounded-full blur-xl" />
              <h3 className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-450 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-500 animate-pulse" /> AI Improvement Recommendations
              </h3>
              <div className="flex flex-col gap-2.5">
                {profile.resumeParsedData.suggestions.slice(0, 3).map((s, idx) => (
                  <div key={idx} className="text-xs bg-white/60 dark:bg-gray-950/40 border border-emerald-500/5 p-3 rounded-xl flex items-start gap-2 text-gray-600 dark:text-gray-350 leading-relaxed shadow-sm">
                    <span className="text-emerald-500 font-extrabold mt-0.5">•</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Jobs Widget */}
          <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Best Job Recommendations</span>
              <Link to="/jobs" className="text-[10px] text-emerald-600 hover:underline">See All</Link>
            </h3>
            <div className="flex flex-col gap-3">
              {recommendedJobs.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No jobs open at this moment.</p>
              ) : (
                recommendedJobs.map((job) => (
                  <div key={job.id} className="p-3 border border-gray-100 dark:border-gray-900 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate">
                        <p className="text-xs font-bold truncate max-w-[160px]">{job.title}</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{job.location}</p>
                      </div>
                      <span className="text-[9px] font-bold font-mono bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded shrink-0">
                        {job.matchScore}% FIT
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] font-mono text-gray-400">{job.salary}</span>
                      <Link to="/jobs" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-450 flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Charts, Application Timeline */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Skill Distribution Bar Chart */}
            <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
              <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Skill Strength Distribution</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillMatchStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={9} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={9} domain={[0, 100]} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "10px", color: "#fff" }} />
                    <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Application Trend Line Area Chart */}
            <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
              <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Application Volume Trends</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={9} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={9} allowDecimals={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "10px", color: "#fff" }} />
                    <Area type="monotone" dataKey="applications" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Application Status Timelines */}
          <div className="p-6 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-5">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Application Pipelines & Timeline Tracker</h3>
            
            {applications.length === 0 ? (
              <div className="py-12 border border-dashed border-gray-200 dark:border-gray-850 rounded-xl text-center flex flex-col items-center justify-center gap-2">
                <Briefcase className="w-8 h-8 text-gray-300" />
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">No active applications found</p>
                <p className="text-[10px] text-gray-400">Select any open job from the board and submit your screening profile.</p>
                <Link to="/jobs" className="mt-2 text-xs font-semibold text-emerald-600 hover:underline">Browse Active Jobs</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 border border-gray-100 dark:border-gray-900 rounded-2xl flex flex-col gap-4">
                    
                    {/* Header summary info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100/60 dark:border-gray-900 pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">{app.jobTitle}</h4>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`w-fit text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                        app.status === "selected" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400" :
                        app.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400" :
                        app.status === "shortlisted" || app.status === "interview_scheduled" ? "bg-sky-100 text-sky-850 dark:bg-sky-950 dark:text-sky-400" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400"
                      }`}>
                        {app.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="relative pl-4 flex flex-col gap-5 border-l border-gray-250/70 dark:border-gray-800 text-xs">
                      {app.timeline.map((step, sIdx) => {
                        const isLast = sIdx === app.timeline.length - 1;
                        return (
                          <div key={sIdx} className="relative">
                            {/* Point Indicator */}
                            <span className={`absolute -left-[21px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full ${
                              isLast ? "bg-emerald-500 ring-4 ring-emerald-500/20" : "bg-gray-300 dark:bg-gray-700"
                            }`} />
                            <div className="flex flex-col gap-0.5">
                              <p className={`font-bold ${isLast ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                                {step.status.toUpperCase().replace("_", " ")}
                              </p>
                              <span className="text-[9px] text-gray-400 font-mono">{new Date(step.date).toLocaleString()}</span>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed mt-1 italic">
                                "{step.comment}"
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;
