import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { 
  Users, Key, ShieldAlert, FileText, Trash2, ShieldCheck, Search, Download, Check, Sparkles, RefreshCw, BarChart3, Mail
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";

export const AdminDashboard: React.FC = () => {
  const { apiFetch, showToast, user: currentAdmin } = useApp();
  
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [jobsCount, setJobsCount] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const usersList = await apiFetch("/api/admin/users");
      setSystemUsers(usersList);

      const allJobs = await apiFetch("/api/jobs");
      setJobsCount(allJobs.length);

      const feedLogs = await apiFetch("/api/admin/logs");
      setLogs(feedLogs);
    } catch (err) {
      console.error("Failed to load admin telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (targetId: string, name: string) => {
    if (targetId === currentAdmin?.id) {
      showToast("Security override: You are forbidden from deleting your own admin account.", "warning");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete user account: ${name}? This action is irreversible.`)) {
      return;
    }

    try {
      await apiFetch(`/api/admin/users/${targetId}`, { method: "DELETE" });
      showToast(`User account for ${name} has been purged.`, "success");
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || "Failed to purge user.", "error");
    }
  };

  const handleChangeRole = async (targetId: string, newRole: string) => {
    if (targetId === currentAdmin?.id) {
      showToast("Security override: You cannot demote your active admin credentials.", "warning");
      return;
    }
    try {
      await apiFetch(`/api/admin/users/${targetId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole })
      });
      showToast(`User role updated successfully!`, "success");
      fetchAdminData();
    } catch (err) {
      showToast("Failed to modify account permissions.", "error");
    }
  };

  const handleDownloadReport = () => {
    // Generate simulated CSV file representing system report
    const headers = "User ID,Name,Email,Role,Registered Date\n";
    const rows = systemUsers.map(u => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.createdAt}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RESUMESCREENING_System_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Audit Report download triggered!", "success");
  };

  // Recharts: User registration statistics over days
  const userRegistrationTrends = [
    { name: "Mon", registrations: 2 },
    { name: "Tue", registrations: 4 },
    { name: "Wed", registrations: 6 },
    { name: "Thu", registrations: 5 },
    { name: "Fri", registrations: systemUsers.length }
  ];

  // Recharts: Logs categories intensity
  const logCategoryStats = [
    { name: "AUTH LOGIN", count: logs.filter(l => l.action.includes("login")).length || 3 },
    { name: "CV PARSE", count: logs.filter(l => l.action.includes("upload") || l.action.includes("resume")).length || 2 },
    { name: "PIPELINE UPDATE", count: logs.filter(l => l.action.includes("status")).length || 4 },
    { name: "JOB CREATION", count: logs.filter(l => l.action.includes("job")).length || 1 },
  ];

  const filteredUsers = systemUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-mono font-bold">LOADING SECURITY TELEMETRY PANELS...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight flex items-center gap-2">
            <span>Security & Administration Control Plane</span>
            <Sparkles className="w-5 h-5 text-red-500" />
          </h1>
          <p className="text-xs text-gray-400">Oversee active SaaS users, view database records, delete accounts, audit log trails, and export diagnostic compliance sheets.</p>
        </div>
        <button
          id="admin-export-report"
          onClick={handleDownloadReport}
          className="w-fit text-xs font-bold text-white px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black transition-colors shadow-lg flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Export System CSV Report</span>
        </button>
      </div>

      {/* Stats Counter Rows */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-red-500" /> System Users
          </span>
          <span className="text-3xl font-display font-black mt-2 text-red-600 dark:text-red-450">{systemUsers.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Unique active credentials</p>
        </div>

        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-sky-500" /> Active Jobs Posted
          </span>
          <span className="text-3xl font-display font-black mt-2 text-sky-600 dark:text-sky-450">{jobsCount}</span>
          <p className="text-[10px] text-gray-400 mt-1">Accepting submissions</p>
        </div>

        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-emerald-500" /> Database Engine Status
          </span>
          <span className="text-3xl font-display font-black mt-2 text-emerald-600 dark:text-emerald-400">JSON</span>
          <p className="text-[10px] text-gray-400 mt-1">Disk file persistence active</p>
        </div>

        <div className="p-4 rounded-2xl border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col justify-between min-h-[100px]">
          <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Audit Log Count
          </span>
          <span className="text-3xl font-display font-black mt-2 text-amber-600 dark:text-amber-450">{logs.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">Traced security events</p>
        </div>
      </div>

      {/* Charts split section */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* User Registration area chart */}
        <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
          <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">User Registrations Velocity</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userRegistrationTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={8} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "10px", color: "#fff" }} />
                <Area type="monotone" dataKey="registrations" stroke="#ef4444" fill="rgba(239,68,68,0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit intensities categories chart */}
        <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
          <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Telemetry Logs Category Intensity</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={logCategoryStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156,163,175,0.15)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={8} allowDecimals={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "10px", color: "#fff" }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Administration & Role management grid */}
      <div className="p-5 rounded-2xl glass-panel border border-gray-150 dark:border-gray-900 bg-white dark:bg-gray-950 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100/60 dark:border-gray-900 pb-3">
          <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">User Account Matrix Controls</h3>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, role..."
              className="pl-8 pr-4 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 focus:outline-none w-56 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-900 text-[10px] font-bold text-gray-400 uppercase font-mono">
                <th className="pb-2.5">User Profile</th>
                <th className="pb-2.5">Email / Workspace</th>
                <th className="pb-2.5">System Role</th>
                <th className="pb-2.5">Permission Shifting</th>
                <th className="pb-2.5 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-gray-900/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">No registered users match your filters.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10">
                    <td className="py-3 font-semibold text-gray-950 dark:text-white flex items-center gap-2">
                      <img
                        src={u.avatarUrl}
                        alt="avatar"
                        className="w-7 h-7 rounded bg-gray-100 border object-cover"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 text-gray-500 font-mono">{u.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                        u.role === "admin" ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400" :
                        u.role === "recruiter" ? "bg-sky-100 text-sky-850 dark:bg-sky-950/40 dark:text-sky-400" :
                        "bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-450"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleChangeRole(u.id, "student")}
                          disabled={u.role === "student"}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${u.role === "student" ? "bg-emerald-500 text-white" : "border hover:bg-gray-55"}`}
                        >
                          Student
                        </button>
                        <button
                          onClick={() => handleChangeRole(u.id, "recruiter")}
                          disabled={u.role === "recruiter"}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${u.role === "recruiter" ? "bg-sky-500 text-white" : "border hover:bg-gray-55"}`}
                        >
                          Recruiter
                        </button>
                        <button
                          onClick={() => handleChangeRole(u.id, "admin")}
                          disabled={u.role === "admin"}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${u.role === "admin" ? "bg-red-500 text-white" : "border hover:bg-gray-55"}`}
                        >
                          Admin
                        </button>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        id={`admin-purge-user-${u.id}`}
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 transition-colors"
                        title="Purge this system user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
